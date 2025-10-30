import React, { useMemo, useState } from 'react'
import { AppPage } from '@/components/app-page'
import AppBackBtn from '@/components/app-back-button'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ScrollView, StyleSheet, View, TouchableOpacity, Linking } from 'react-native'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useEscrow } from '@/components/escrow/use-escrow'
import { lamportsToSol } from '@/utils/lamports-to-sol'
import { Ionicons } from '@expo/vector-icons'
import SlideButton from '@/components/ui/shrimmer-btn/ShrimmerBtn'
import { useSharedValue } from 'react-native-reanimated'
import { logger } from '@/utils/logger.service'
import { AppCardView } from '@/components/app-card-view'

const AssetId = () => {
  const router = useRouter();
  const { assetId } = useLocalSearchParams();
  const cardBg = useThemeColor({}, 'cardBg');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const accent = useThemeColor({}, 'accent');
  
  const completed = useSharedValue(false);
  const [redeemCompleted, setRedeemCompleted] = useState(false);
  
  const { escrowAccounts, getEscrowPDA, withdraw } = useEscrow();

  // Find the specific escrow by ID
  const escrowData = useMemo(() => {
    if (!escrowAccounts.data || !assetId) return null;
    
    const escrowId = typeof assetId === 'string' ? assetId : assetId[0];
    return escrowAccounts.data.find(
      (escrow) => escrow.escrowId.toString() === escrowId
    );
  }, [escrowAccounts.data, assetId]);

  // Get PDA address
  const pdaAddress = useMemo(() => {
    if (!escrowData) return '';
    const [pda] = getEscrowPDA(escrowData.escrowId);
    return pda.toBase58();
  }, [escrowData, getEscrowPDA]);

  // Format unlock time
  const unlockDate = useMemo(() => {
    if (!escrowData) return '';
    const timestamp = Number(escrowData.unlockTime);
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [escrowData]);

  // Calculate time remaining and lock status
  const { timeRemaining, isLocked } = useMemo(() => {
    if (!escrowData) return { timeRemaining: '', isLocked: true };
    const unlockTimestamp = Number(escrowData.unlockTime);
    const now = Date.now() / 1000;
    const remaining = Math.max(0, unlockTimestamp - now);
    
    const days = Math.floor(remaining / (24 * 3600));
    const hours = Math.floor((remaining % (24 * 3600)) / 3600);
    
    let timeString = '';
    if (days > 0) {
      timeString = `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      timeString = `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (remaining > 0) {
      timeString = 'Less than 1 hour';
    } else {
      timeString = 'Ready to redeem';
    }
    
    return {
      timeRemaining: timeString,
      isLocked: remaining > 0
    };
  }, [escrowData]);

  const openInExplorer = () => {
    const network = 'devnet'; // Change based on your network
    const url = `https://explorer.solana.com/address/${pdaAddress}?cluster=${network}`;
    Linking.openURL(url);
  };

  const handleRedeem = async () => {
    if (!escrowData || isLocked) {
      logger.error('handleRedeem', 'Cannot redeem', 'Asset is still locked');
      return;
    }

    try {
      const signature = await withdraw.mutateAsync(escrowData.escrowId);
      logger.info(`Successfully redeemed ${lamportsToSol(escrowData.amount)} SOL - ${signature}`);
      
      setRedeemCompleted(true);
      completed.value = true;

      // Navigate back after successful redemption
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error: any) {
      logger.error('handleRedeem', 'Failed to redeem', error?.message || error);
      completed.value = false;
      setRedeemCompleted(false);
    }
  };

  if (!escrowData) {
    return (
      <AppPage>
        <AppBackBtn onPress={() => router.back()} />
        <AppView style={styles.centerContent}>
          <AppText type="medium">Escrow not found</AppText>
        </AppView>
      </AppPage>
    );
  }

  const amount = lamportsToSol(escrowData.amount);

  return (
    <AppPage>
      <AppBackBtn onPress={() => router.back()} title='Locked Position Details' />
      
      <AppView style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
          {/* Amount Card */}
          <AppView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
            <AppText type="caption" style={styles.label}>Locked Amount</AppText>
            <AppText type="subheading" style={[ { color: accent }]}>
              {amount.toFixed(4)} SOL
            </AppText>
          </AppView>

          {/* Status Card */}
          <AppView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
            <AppCardView style={styles.row}>
              <AppCardView style={styles.infoItem}>
                <AppText type="caption" style={styles.label}>Status</AppText>
                <AppText type="button" style={{ color: isLocked ? accent : '#4CAF50' }}>
                  {isLocked ? 'Locked' : 'Unlocked'}
                </AppText>
              </AppCardView>
              <AppCardView style={styles.infoItem}>
                <AppText type="caption" style={styles.label}>Time Remaining</AppText>
                <AppText type="button">{timeRemaining}</AppText>
              </AppCardView>
            </AppCardView>
          </AppView>

          {/* Unlock Date Card */}
          <AppView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
            <AppText type="caption" style={styles.label}>Unlock Date</AppText>
            <AppText type="button">{unlockDate}</AppText>
          </AppView>

          {/* View in Explorer Link */}
          <TouchableOpacity 
            onPress={openInExplorer}
            style={styles.explorerLink}
          >
            <Ionicons name="open-outline" size={16} color={accent} />
            <AppText type="caption" style={[styles.explorerLinkText, { color: accent }]}>
              View in Solana Explorer
            </AppText>
          </TouchableOpacity>
        </ScrollView>

        {/* Slide to Redeem Button */}
        <AppView style={styles.sliderBtnContainer}>
          <AppView style={{ opacity: isLocked ? 0.4 : 1 }}>
            <SlideButton
              startIcon={<Ionicons name='chevron-forward-sharp' color={'white'} />}
              endIcon={<Ionicons size={18} name={redeemCompleted ? "checkmark" : isLocked ? "lock-closed" : "checkmark-circle-outline"} color={'white'} />}
              fillColor={accent as any}
              handleColor={'#000000'}
              baseColor={text + '10'}
              aboveText={isLocked ? "locked..." : "redeeming..."}
              finalText={redeemCompleted ? "Redeemed!" : "Success!"}
              shimmerTextProps={{
                text: isLocked ? 'Locked - Wait to redeem' : 'Slide to redeem',
                speed: 4000,
                color: text + '80'
              }}
              style={styles.ctaSlideButton}
              completed={completed}
              onComplete={handleRedeem}
            />
          </AppView>
          {isLocked && (
            <AppText type="caption" style={styles.lockedText}>
              You can redeem after {timeRemaining}
            </AppText>
          )}
        </AppView>
      </AppView>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  label: {
    opacity: 0.6,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  explorerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 20,
  },
  explorerLinkText: {
    fontSize: 14,
  },
  ctaSlideButton: {
    height: 64,
    borderRadius: 32,
  },
  sliderBtnContainer: {
    paddingBottom: 30,
  },
  lockedText: {
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
});

export default AssetId
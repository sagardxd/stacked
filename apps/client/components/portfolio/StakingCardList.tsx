import React, { useMemo, useEffect } from 'react';
import { StakingCard } from './StakingCard';
import { SipCard } from './SipCard';
import { SipAsset, StakingAsset } from '@/types/asset.types';
import { useEscrow } from '@/components/escrow/use-escrow';
import { lamportsToSol } from '@/utils/lamports-to-sol';
import { useStakingStore } from '@/store/staking.store';
import { ActivityIndicator, View, StyleSheet, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { AppText } from '@/components/app-text';

interface StakingCardListProps {
    onCardPress?: (asset: StakingAsset | SipAsset) => void;
}

export const StakingCardList: React.FC<StakingCardListProps> = ({ onCardPress }) => {
    const { escrowAccounts } = useEscrow();
    const { setPositions, setLoading, isLoading } = useStakingStore();
    const cardBg = useThemeColor({}, 'cardBg');

    // Set loading state
    useEffect(() => {
        const loading = escrowAccounts.isLoading || escrowAccounts.isFetching;
        setLoading(loading);
    }, [escrowAccounts.isLoading, escrowAccounts.isFetching, setLoading]);

    // Convert escrow data array to StakingAsset format
    const lockedEscrowAssets = useMemo((): StakingAsset[] => {
        if (!escrowAccounts?.data || escrowAccounts.data.length === 0) {
            return [];
        }

        return escrowAccounts.data
            .filter((escrow) => escrow.amount.toNumber() > 0)
            .map((escrow): StakingAsset => {
                const unlockTimestamp = Number(escrow.unlockTime);
                const unlockDate = new Date(unlockTimestamp * 1000);
                const now = Date.now();
                const unlockTimeMs = unlockDate.getTime();
                
                // Calculate time remaining in seconds
                const timeRemainingSeconds = Math.max(0, Math.floor((unlockTimeMs - now) / 1000));
                const timeRemainingDays = Math.ceil(timeRemainingSeconds / (3600 * 24));
                
                const estimatedTotalDays = Math.max(365, timeRemainingDays + 30); // At least what's left + buffer
                
                // Progress = (totalDuration - timeRemaining) / totalDuration
                const elapsedDays = estimatedTotalDays - timeRemainingDays;
                const progress = Math.max(0, Math.min(1, elapsedDays / estimatedTotalDays));

                // Format maturity date
                const maturityDateStr = unlockDate.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                // Convert amount from lamports to SOL
                const stakedAmountSol = lamportsToSol(escrow.amount);

                return {
                    id: `locked-escrow-${escrow.escrowId.toString()}`,
                    name: 'Locked SOL',
                    symbol: 'SOL',
                    logo: 'solana',
                    maturityDate: maturityDateStr,
                    stakedAmount: stakedAmountSol, 
                    timeLeft: timeRemainingDays,
                    totalDuration: estimatedTotalDays,
                    progress: progress,
                    color: '#50C4AC',
                    imageLink: 'https://res.cloudinary.com/dpk1nbczk/image/upload/v1759233401/solana-logo_s566xz.png'
                };
            })
            .filter((asset) => (asset.stakedAmount || 0) > 0);
        
        return lockedEscrowAssets;
    }, [escrowAccounts?.data]);

    // Update positions in store when lockedEscrowAssets changes
    useEffect(() => {
        const storePositions = lockedEscrowAssets.map((asset) => ({
            id: asset.id,
            symbol: asset.symbol,
            stakedAmount: asset.stakedAmount || 0,
        }));
        setPositions(storePositions);
    }, [lockedEscrowAssets, setPositions]);


    // Combine locked escrows with demo assets
    const allAssets = useMemo(() => {
        const assets: (StakingAsset | SipAsset)[] = [];
        
        // Add all locked escrows
        if (lockedEscrowAssets.length > 0) {
            assets.push(...lockedEscrowAssets);
        }
        
        return assets;
    }, [lockedEscrowAssets]);

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: cardBg }]}>
                <ActivityIndicator size="large" color="#50C4AC" />
                <AppText type="caption" style={styles.loadingText}>Loading staking positions...</AppText>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{paddingBottom: 150}} showsVerticalScrollIndicator={false}>
            {allAssets.map((asset: StakingAsset | SipAsset) => (
                'maturityDate' in asset ? (
                    <StakingCard
                        key={asset.id}
                        asset={asset}
                        onPress={() => onCardPress?.(asset)}
                    />
                ) : (
                    <SipCard
                        key={asset.id}
                        asset={asset}
                        onPress={() => onCardPress?.(asset)}
                    />
                )
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        padding: 40,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    loadingText: {
        marginTop: 12,
        textAlign: 'center',
    },
});

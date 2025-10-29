import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { AppText } from '../app-text';
import { AppView } from '../app-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEscrow } from '../escrow/use-escrow';
import { lamportsToSol } from '@/utils/lamports-to-sol';
import { Ionicons } from '@expo/vector-icons';

export function LockedEscrowCard() {
  const { escrowAccount } = useEscrow();
  const text = useThemeColor({}, 'text');
  const accent = useThemeColor({}, 'accent');


  if (escrowAccount.isLoading) {
    return (
      <AppView style={[styles.card, { backgroundColor: text + '10' }]}>
        <AppText style={{ color: text }}>Loading locked assets...</AppText>
      </AppView>
    );
  }

  if (!escrowAccount.data) {
    return (
      <AppView style={[styles.card, { backgroundColor: text + '10' }]}>
        <AppView style={styles.noDataContainer}>
          <AppText style={{ color: text + '80', textAlign: 'center' }}>
            No locked assets found
          </AppText>
          <TouchableOpacity 
            onPress={() => {
              escrowAccount.refetch();
            }}
            style={[styles.refreshButton, { backgroundColor: accent }]}
          >
            <Ionicons name="refresh" size={16} color="#000" />
            <AppText style={styles.refreshText}>Refresh</AppText>
          </TouchableOpacity>
        </AppView>
      </AppView>
    );
  }

  const amountSol = lamportsToSol(escrowAccount.data.amount);
  const unlockDate = new Date(Number(escrowAccount.data.unlockTime) * 1000);
  const now = new Date();
  const isUnlocked = now >= unlockDate;
  const timeRemaining = unlockDate.getTime() - now.getTime();
  
  // Calculate time remaining
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <AppView style={[styles.card, { backgroundColor: text + '10' }]}>
      {/* Header */}
      <AppView style={styles.header}>
        <AppText type="medium" style={[styles.title, { color: text }]}>
          🔒 Locked Position
        </AppText>
        {isUnlocked && (
          <AppView style={[styles.badge, { backgroundColor: accent }]}>
            <AppText style={styles.badgeText}>Ready to Withdraw</AppText>
          </AppView>
        )}
      </AppView>

      {/* Amount */}
      <AppView style={styles.amountContainer}>
        <AppText type="heading" style={[styles.amount, { color: accent }]}>
          {amountSol.toFixed(2)} SOL
        </AppText>
        <AppText style={[styles.label, { color: text + '80' }]}>Locked Amount</AppText>
      </AppView>

      {/* Unlock Info */}
      <AppView style={styles.infoContainer}>
        <AppView style={styles.infoRow}>
          <AppText style={[styles.infoLabel, { color: text + '80' }]}>Unlock Date:</AppText>
          <AppText style={[styles.infoValue, { color: text }]}>
            {unlockDate.toLocaleDateString()}
          </AppText>
        </AppView>

        <AppView style={styles.infoRow}>
          <AppText style={[styles.infoLabel, { color: text + '80' }]}>Unlock Time:</AppText>
          <AppText style={[styles.infoValue, { color: text }]}>
            {unlockDate.toLocaleTimeString()}
          </AppText>
        </AppView>

        {!isUnlocked && (
          <AppView style={styles.infoRow}>
            <AppText style={[styles.infoLabel, { color: text + '80' }]}>Time Remaining:</AppText>
            <AppText style={[styles.infoValue, { color: accent }]}>
              {daysRemaining > 0 ? `${daysRemaining}d ${hoursRemaining}h` : `${hoursRemaining}h`}
            </AppText>
          </AppView>
        )}
      </AppView>

      {/* Status */}
      <AppView style={styles.statusContainer}>
        <AppView style={[styles.statusDot, { backgroundColor: isUnlocked ? '#4ade80' : accent }]} />
        <AppText style={[styles.statusText, { color: text }]}>
          {isUnlocked ? 'Unlocked - You can withdraw now' : 'Locked - Earning rewards'}
        </AppText>
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    gap: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  amountContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    marginTop: 4,
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
  },
});


import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppText } from '@/components/app-text';

export interface StakingAsset {
  id: string;
  name: string;
  symbol: string;
  logo: string; // For now, we'll use a placeholder
  maturityDate: string;
  currentAPY: number;
  timeLeft: number; // in days
  totalDuration: number; // in days
  progress: number; // 0-1
  color: string;
}

interface StakingCardProps {
  asset: StakingAsset;
  onPress?: () => void;
}

export const StakingCard: React.FC<StakingCardProps> = ({ asset, onPress }) => {
  const progressPercentage = Math.round(asset.progress * 100);

  return (
    <Pressable 
      style={styles.card} 
      onPress={onPress}
      android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
    >
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.leftSection}>
          {/* Logo placeholder - you can replace with actual logo component */}
          <View style={[styles.logoContainer, { backgroundColor: asset.color }]}>
            <AppText type="medium" style={styles.logoText}>
              {asset.symbol.charAt(0)}
            </AppText>
          </View>
          
          <View style={styles.assetInfo}>
            <AppText type="heading" style={styles.assetName}>
              {asset.name}
            </AppText>
            <AppText type="small" style={styles.maturityDate}>
              Maturity: {asset.maturityDate}
            </AppText>
          </View>
        </View>

        <View style={styles.rightSection}>
          <AppText type="small" style={styles.apyLabel}>
            Current Fixed APY
          </AppText>
          <AppText type="heading" style={[styles.apyValue, { color: asset.color }]}>
            {asset.currentAPY.toFixed(2)}%
          </AppText>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.timeInfo}>
          <View style={styles.timeRow}>
            <AppText type="medium" style={styles.timeLabel}>
              Time Left
            </AppText>
            <AppText type="medium" style={styles.timeValue}>
              {asset.timeLeft} days
            </AppText>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: asset.color 
                  }
                ]} 
              />
            </View>
          </View>

          <View style={styles.timeRow}>
            <AppText type="medium" style={styles.timeLabel}>
              Total Duration
            </AppText>
            <AppText type="medium" style={styles.timeValue}>
              {Math.round(asset.totalDuration / 30)} months
            </AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  maturityDate: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  apyLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  apyValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  timeInfo: {
    gap: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  timeValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    marginVertical: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

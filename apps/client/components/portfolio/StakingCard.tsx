import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppText } from '@/components/app-text';
import { Image } from 'expo-image';
import { StakingAsset } from '@/types/asset.types';
import { useThemeColor } from '@/hooks/use-theme-color';

interface StakingCardProps {
  asset: StakingAsset;
  onPress?: () => void;
}

export const StakingCard: React.FC<StakingCardProps> = ({ asset, onPress }) => {
  const progressPercentage = Math.round(asset.progress * 100);
  const cardBg = useThemeColor({}, 'cardBg'); 
  const border = useThemeColor({}, 'border');

  return (
    <Pressable 
      style={[styles.card, { backgroundColor: cardBg, borderColor: border }]} 
      onPress={onPress}
      android_ripple={{ color: border }}
    >
      {/* Top Section */} 
      <View style={styles.topSection}>
        <View style={styles.leftSection}>
          {/* Logo placeholder - you can replace with actual logo component */}
         <Image source={{uri: asset.imageLink}} style={styles.logoContainer} />
          
          <View style={styles.assetInfo}>
            <AppText type="medium" style={styles.assetName}>
              {asset.name}
            </AppText>
            <AppText type="caption" style={styles.maturityDate}>
              Maturity: {asset.maturityDate}
            </AppText>
          </View>
        </View>

        <View style={styles.rightSection}>
          <AppText type="caption" style={styles.apyLabel}>
            Current Fixed APY
          </AppText>
          <AppText type="medium" style={[ { color: asset.color }]}>
            {asset.currentAPY.toFixed(2)}%
          </AppText>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={[styles.bottomSection, { borderTopColor: border }]}>
        <View style={styles.timeInfo}>
          <View style={styles.timeRow}>
            <AppText type="caption">
              Time Left
            </AppText>
            <AppText type="caption">
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
            <AppText type="caption">
              Total Duration
            </AppText>
            <AppText type="caption">
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
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
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
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    marginBottom: 4
  },
  maturityDate: {
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  apyLabel: {
    marginBottom: 4,
  },
  bottomSection: {
    borderTopWidth: 1,
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

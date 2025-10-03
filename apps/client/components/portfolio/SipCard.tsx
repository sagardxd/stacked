import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppText } from '@/components/app-text';
import { Image } from 'expo-image';
import { SipAsset } from '@/types/asset.types';
import { useThemeColor } from '@/hooks/use-theme-color';

interface SipCardProps {
  asset: SipAsset;
  onPress?: () => void;
}

export const SipCard: React.FC<SipCardProps> = ({ asset, onPress }) => {
  const border = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'cardBg');

  return (
    <View style={styles.cardcontainer}>
      <Pressable
        style={[styles.card, { borderColor: border, backgroundColor: cardBg }]}
        onPress={onPress}
        android_ripple={{ color: border, }}
      >
        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.leftSection}>
            <Image source={{ uri: asset.imageLink }} style={styles.logoContainer} />

            <View style={styles.assetInfo}>
              <AppText type="medium" style={styles.assetName}>
                {asset.name}
              </AppText>
              {/* <AppText type="caption">
              SIP • {asset.frequency.charAt(0).toUpperCase() + asset.frequency.slice(1)}
            </AppText> */}
              <AppText type="caption">
                {`Installment: ${asset.amountPerInstallment.toFixed(2)} ${asset.symbol}`}
              </AppText>
            </View>
          </View>

          <View style={styles.rightSection}>
            <AppText type="caption" style={styles.mutedLabel}>
              Returns
            </AppText>
            <AppText type="medium" style={[{ color: asset.color }]}>
              {asset.returnsPercentage.toFixed(2)}%
            </AppText>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { borderTopColor: border }]}>
          <View style={styles.infoItem}>
            <AppText type="caption" style={styles.mutedLabel}>Installment</AppText>
            <AppText type="label">{asset.amountPerInstallment.toFixed(2)} {asset.symbol}</AppText>
          </View>
          <View style={styles.infoItem}>
            <AppText type="caption" style={styles.mutedLabel}>Next Installment</AppText>
            <AppText type="label">{new Date(asset.nextInstallmentDate).toLocaleDateString()}</AppText>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardcontainer: {
    borderRadius: 26,
    overflow: 'hidden',
  },
  card: {
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 16,
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
    width: 26,
    height: 26,
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
  rightSection: {
    alignItems: 'flex-end',
  },
  mutedLabel: {
    marginBottom: 4,
  },
  bottomSection: {
    flex: 1,
    borderTopWidth: 1,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    gap: 8
  },
});

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppText } from '@/components/app-text';
import { Image } from 'expo-image';
import { AssetForSale } from '@/types/sell.types';
import { useThemeColor } from '@/hooks/use-theme-color';

type SaleCardProps = {
  holding: AssetForSale;
  onPress?: () => void;
};

const SaleCard = ({ holding, onPress }: SaleCardProps) => {
  const cardBg = useThemeColor({}, 'cardBg');
  const border = useThemeColor({}, 'border');

  return (
    <View style={styles.cardContainer}>
      <Pressable
        style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}
        onPress={onPress}
        android_ripple={{ color: border }}
      >
        {/* Asset Info */}
        <View style={styles.topSection}>
          <View style={styles.leftSection}>
            <Image source={{ uri: holding.imageLink }} style={styles.logo} />
            <View style={styles.assetInfo}>
              <AppText type="medium" style={styles.assetName}>
                {holding.name}
              </AppText>
              <AppText type="caption">
                Maturity: {holding.maturityDate}
              </AppText>
            </View>
          </View>

          <View style={styles.rightSection}>
            <AppText type="caption" style={styles.label}>
              APY
            </AppText>
            <AppText type="medium" style={[{ color: holding.color }]}>
              {holding.currentAPY.toFixed(2)}%
            </AppText>
          </View>
        </View>

        {/* Sale Amount */}
        <View style={[styles.bottomSection, { borderTopColor: border }]}>
          <View style={styles.saleRow}>
            <AppText type="caption">Selling Amount</AppText>
            <AppText type="medium">${holding.sellAmount.toFixed(2)}</AppText>
          </View>
          <View style={styles.saleRow}>
            <AppText type="caption">Time Left</AppText>
            <AppText type="caption">{holding.timeLeft} days</AppText>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 26,
    overflow: 'hidden',
  },
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
    marginBottom: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 26,
    height: 26,
    marginRight: 12,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    marginBottom: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  label: {
    marginBottom: 4,
  },
  bottomSection: {
    borderTopWidth: 1,
    paddingTop: 16,
    gap: 12,
  },
  saleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SaleCard;
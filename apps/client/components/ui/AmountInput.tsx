import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '@/components/app-text';
import AppTextInput from '@/components/app-textInput';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import AssetImage from '../asset/AssetImage';
import { Asset } from '@/types/asset.types';
import AssetValueCalculator from '../asset/AssetValueCalculator';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  currency?: string;
  balance?: string;
  onHalfPress?: () => void;
  onMaxPress?: () => void;
  onCurrencyPress?: () => void;
}

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChangeText,
  placeholder = '0.00',
  currency = 'SOL',
  balance = '0 SOL',
  onHalfPress,
  onMaxPress,
  onCurrencyPress,
}) => {
  const text = useThemeColor({}, 'text');
  const border = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'cardBg');

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor: border }]}>
      {/* Left Section - Amount */}
      <View style={styles.leftSection}>
        <AppText type='caption' style={[ { color: text + '99' }]}>
          AMOUNT
        </AppText>
        
        <View style={styles.valueSection}>
          <AppTextInput
            value={value}
            onChangeText={onChangeText}
            keyboardType='decimal-pad'
            placeholder={placeholder}
            style={[styles.mainValue, { color: text }]}
            variant='secondary'
          />
          <AssetValueCalculator volume={value}/>
         
        </View>
      </View>

      {/* Right Section - Controls */}
      <View style={styles.rightSection}>
        {/* Balance Display */}
        <View style={styles.balanceContainer}>
          <Ionicons name='wallet-outline' size={14} color={text + '60'} />
          <AppText type='caption' style={[styles.balanceText, { color: text + '60' }]}>
            {balance}
          </AppText>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.quickButton, { borderColor: border }]}
            onPress={onHalfPress}
          >
            <AppText type='caption' style={[styles.buttonText, { color: text }]}>
              HALF
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickButton, { borderColor: border }]}
            onPress={onMaxPress}
          >
            <AppText type='caption' style={[styles.buttonText, { color: text }]}>
              MAX
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Currency Selector */}
        <TouchableOpacity
          style={[styles.currencySelector, { backgroundColor: text + '10' }]}
          onPress={onCurrencyPress}
        >
          <View style={[styles.currencyIcon, {backgroundColor: cardBg}]}>
            <AssetImage asset={Asset.SOL} width={14} height={14}/>
          </View>
          <AppText type='caption' style={[ { color: text }]}>
            {currency}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  leftSection: {
    flex: 1,
    gap: 8,
  },
  valueSection: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  mainValue: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 12,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceText: {
    fontSize: 12,
    fontWeight: '400',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 18,
    gap: 4
  },
  currencyIcon: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AmountInput;

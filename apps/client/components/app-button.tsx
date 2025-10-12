import React from 'react'
import { TouchableOpacity, StyleSheet, ActivityIndicator, View, StyleProp, StyleSheetProperties, ViewStyle } from 'react-native'
import { AppText } from '@/components/app-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { UiIconSymbol, UiIconSymbolName } from './ui/ui-icon-symbol'

interface AppButtonProps {
  title: string
  onPress: () => void
  type: 'primary' | 'secondary'
  buttonStyle?: ViewStyle
  iconName?: UiIconSymbolName
  loading?: boolean
  disabled?: boolean
}

export function AppButton({
  title,
  onPress,
  type,
  buttonStyle,
  iconName,
  loading = false,
  disabled = false
}: AppButtonProps) {
  const accentColor = useThemeColor({}, 'accent')
  const secondaryBg = useThemeColor({}, 'accent')
  const secondaryBorder = useThemeColor({}, 'buttonSecondaryBorder')

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: type === 'primary' ? accentColor : secondaryBg,
          borderColor: type === 'secondary' ? secondaryBorder : 'transparent',
          borderWidth: type === 'secondary' ? 1 : 0,
        },
        buttonStyle,
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {loading ?
        <ActivityIndicator />
        :
        <View style={[styles.buttonTextContainer]}>
          <AppText type='button' style={[
            styles.buttonText,
            disabled && styles.disabledButtonText
          ]}>
            {title}
          </AppText>
        </View>

      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonTextContainer: {
    flexDirection: 'row',
    gap: 2
  },
  buttonText: {
    textAlign: 'center',
  },
  disabledButtonText: {
    opacity: 0.7,
  },
  icon: {
    fontWeight: '900',
  }

})

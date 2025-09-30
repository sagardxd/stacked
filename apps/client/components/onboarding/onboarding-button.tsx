import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { AppText } from '@/components/app-text'
import { useThemeColor } from '@/hooks/use-theme-color'

interface OnboardingButtonProps {
  title: string
  onPress: () => void
  disabled?: boolean
}

export function OnboardingButton({ 
  title, 
  onPress, 
  disabled = false
}: OnboardingButtonProps) {
  const accentColor = useThemeColor({}, 'accent')

  return (
    <TouchableOpacity 
      style={[
        styles.button,
        {
          backgroundColor: accentColor,
        },
        disabled && styles.disabledButton
      ]} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <AppText style={[
        styles.buttonText,
        disabled && styles.disabledButtonText
      ]}>
        {title}
      </AppText>
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
  buttonText: {
    fontFamily: 'SkModernistBold',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  disabledButtonText: {
    opacity: 0.7,
  },
})

import { useThemeColor } from '@/hooks/use-theme-color'
import { View, type ViewProps } from 'react-native'
import React from 'react'

export function AppCardView({ style, ...otherProps }: ViewProps) {
  const backgroundColor = useThemeColor({}, 'cardBg')

  return <View style={[{ backgroundColor }, style]} {...otherProps} />
}

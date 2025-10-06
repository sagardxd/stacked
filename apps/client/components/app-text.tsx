import { StyleSheet, Text, type TextProps } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'

export type AppTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  type?: 'heading' | 'subheading' | 'caption' | 'small' | 'medium' | 'body' | 'button' | 'label'
}

export function AppText({ style, lightColor, darkColor, type = 'label', ...rest }: AppTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  return (
    <Text
      style={[
        { color },
        type === 'heading' ? styles.heading : undefined,
        type === 'subheading' ? styles.subheading : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'small' ? styles.small : undefined,
        type === 'medium' ? styles.medium : undefined,
        type === 'button' ? styles.button : undefined,
        type === 'body' ? styles.body : undefined,
        type === 'label' ? styles.label : undefined,
        style,
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 50,
    lineHeight: 48,
    fontFamily: 'SkModernistBold',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 36,
    lineHeight: 44,
    fontFamily: 'SkModernistBold',
    letterSpacing: -0.3,
  },
  medium: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'SkModernistBold',
    letterSpacing: -0.2,
  },
  button: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'SkModernistBold',
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'SkModernistRegular',
    letterSpacing: 0,
    opacity: 0.7,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'SkModernistBold',
    letterSpacing: 0.5,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'SkModernistRegular',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'SkModernistRegular',
    opacity: 1,
  },
})

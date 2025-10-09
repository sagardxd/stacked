import Ionicons from '@expo/vector-icons/Ionicons'
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native'

const MAPPING = {
  link: 'link',
  search: 'search',
  home: 'home-outline',
  wallet: 'wallet-outline',
  lock: 'lock-closed-outline',
  settings: 'settings-outline',
  pricetag: 'pricetag-outline',
} as const

export type UiIconSymbolName = keyof typeof MAPPING

export function UiIconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: UiIconSymbolName
  size?: number
  color: string | OpaqueColorValue
  style?: StyleProp<TextStyle>
}) {
  return <Ionicons color={color} size={size} name={MAPPING[name]} style={style} />
}
  
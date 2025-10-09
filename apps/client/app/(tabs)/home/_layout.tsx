import { WalletUiDropdown } from '@/components/solana/wallet-ui-dropdown'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack 
    screenOptions={{headerShown: false}}
    // screenOptions={{ headerTitle: '', headerRight: () => <WalletUiDropdown /> }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[validatorId]" />
      <Stack.Screen name="sip" />
      <Stack.Screen name="lock" />
    </Stack>
  )
}
  
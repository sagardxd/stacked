import { WalletUiDropdown } from '@/components/solana/wallet-ui-dropdown'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack 
    screenOptions={{headerShown: false}}
    // screenOptions={{ headerTitle: '', headerRight: () => <WalletUiDropdown /> }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="[id]" 
        options={{
          headerShown: true,
          headerTitle: 'Validator Detail',
        }}
      />
    </Stack>
  )
}

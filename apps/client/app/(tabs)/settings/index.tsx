import { AppPage } from '@/components/app-page'
import { AppText } from '@/components/app-text'
import { WalletConnection } from '@/components/settings/wallet-connection'
import { StyleSheet } from 'react-native'

export default function TabSettingsScreen() {
  return (
    <AppPage>
      <AppText type='medium' style={styles.header}>Settings</AppText>
      <WalletConnection />
    </AppPage>
  )
}



const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
})

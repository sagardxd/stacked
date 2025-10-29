import React from 'react'
import { StyleSheet, View } from 'react-native'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { AppButton } from '@/components/app-button'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { useCluster } from '@/components/cluster/cluster-provider'
import { useThemeColor } from '@/hooks/use-theme-color'
import { ClusterNetwork } from '@/components/cluster/cluster-network'
import { ellipsify } from '@/utils/ellipsify'

export function WalletConnection() {
  const { account, connect, disconnect } = useWalletUi()
  const { selectedCluster } = useCluster()
  const cardBg = useThemeColor({}, 'cardBg')
  const border = useThemeColor({}, 'border')
  const text = useThemeColor({}, 'text')
  const accent = useThemeColor({}, 'accent')

  const isConnected = !!account
  const networkName = selectedCluster.network === ClusterNetwork.Mainnet ? 'Mainnet' : 
                      selectedCluster.network === ClusterNetwork.Devnet ? 'Devnet' : 
                      selectedCluster.network === ClusterNetwork.Testnet ? 'Testnet' : 
                      'Custom'

  return (
    <AppView style={[styles.container, {  borderColor: border }]}>
      <AppText type="button" style={styles.title}>
        Wallet Connection
      </AppText>

      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <AppText type="caption" style={[styles.label, { color: text }]}>
            Status:
          </AppText>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: isConnected ? accent : '#666' }
          ]} />
          <AppText type="body" style={styles.statusText}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </AppText>
        </View>

        <View style={styles.statusRow}>
          <AppText type="caption" style={[styles.label, { color: text }]}>
            Network:
          </AppText>
          <AppText type="body" style={styles.statusText}>
            {networkName}
          </AppText>
        </View>

        {isConnected && account && (
          <View style={styles.statusRow}>
            <AppText type="caption" style={[styles.label, { color: text }]}>
              Address:
            </AppText>
            <AppText type="body" style={styles.statusText}>
              {ellipsify(account.publicKey.toString(), 8)}
            </AppText>
          </View>
        )}
      </View>

      <AppButton
        title={isConnected ? 'Disconnect' : 'Connect Wallet'}
        onPress={isConnected ? disconnect : connect}
        type={isConnected ? 'secondary' : 'primary'}
        buttonStyle={styles.button}
      />
    </AppView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  title: {
    marginBottom: 16,
  },
  statusContainer: {
    gap: 12,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    minWidth: 70,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    flex: 1,
  },
  button: {
    width: '100%',
  },
})


import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { PublicKey } from '@solana/web3.js'
import Snackbar from 'react-native-snackbar'
import { ActivityIndicator, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from '@react-navigation/elements'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useMutation } from '@tanstack/react-query'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { ellipsify } from '@/utils/ellipsify'
import { getNonce, verifyNonce } from '@/services/auth.service'
import bs58 from 'bs58'

function useSignMessage({ address }: { address: PublicKey }) {
  const { signMessage } = useWalletUi()
  return useMutation({
    mutationFn: async (input: { message: string }) => {
      return signMessage(new TextEncoder().encode(input.message)).then((signature) => {
        const encodedSignature = bs58.encode(signature) // ✅ signature is Uint8Array
        return encodedSignature
      })  
    },
  })
}

export function DemoFeatureSignMessage({ address }: { address: PublicKey }) {
  const signMessage = useSignMessage({ address })
  const [message, setMessage] = useState('Hello world')
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#333333' }, 'background')
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')

  useEffect(() => {
    const fetchNonce = async () => {
      await getNonceString()
    }

    if (address) {
      fetchNonce()
    }
  }, [address])


  const getNonceString = async () => {
    if (!address) return;
    try {
      const response = await getNonce(address);
      if (response) {
        const nonce = response;
        console.log('oct getNonceString nonce: ', nonce);
        setMessage(nonce);
      } else {
        console.error('Failed to fetch nonce');
      }
    } catch (error) {
      console.error('Error fetching nonce:', error);
    }
  }

  const handleSign = async () => {
    try {
      const signature = await signMessage.mutateAsync({ message })

      console.log("signate", signature);
      const verifyInput = { walletPubkey: address, message, signature}
      const verify_data = await verifyNonce(verifyInput);

      console.log('verify_data: ', verify_data)

    } catch (err) {
      console.error(`Error signing message: ${err}`, err)
    }
  }

  return (
    <AppView>
      <AppText type="body">Sign message with connected wallet.</AppText>

      <View style={{ gap: 16 }}>
        <AppText>Message</AppText>
        <TextInput
          style={{
            backgroundColor,
            color: textColor,
            borderWidth: 1,
            borderRadius: 25,
            paddingHorizontal: 16,
          }}
          value={message}
          onChangeText={setMessage}
        />
        {signMessage.isPending ? (
          <ActivityIndicator />
        ) : (
          <Button
            disabled={signMessage.isPending || message?.trim() === ''}
            onPress={handleSign}
            variant="filled"
          >
            Sign Message
          </Button>
        )}
      </View>
      {signMessage.isError ? (
        <AppText style={{ color: 'red', fontSize: 12 }}>{`${signMessage.error.message}`}</AppText>
      ) : null}
    </AppView>
  )
}

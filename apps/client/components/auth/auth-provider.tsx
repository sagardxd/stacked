import { createContext, type PropsWithChildren, use, useEffect, useMemo, useState } from 'react'
import { useMobileWallet } from '@/components/solana/use-mobile-wallet'
import { AppConfig } from '@/constants/app-config'
import { Account, useAuthorization } from '@/components/solana/use-authorization'
import { useMutation } from '@tanstack/react-query'
import { useAuthManager } from '@/hooks/auth-manager'
import { logger } from '@/utils/logger.service'
import { removeFromSecureStore, saveToSecureStore } from '@/store/secure-store'
import { KeyType } from '@/types/keys.types'

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => Promise<Account>
  signOut: () => Promise<void>
  token?: string | null
}

const Context = createContext<AuthState>({} as AuthState)

export function useAuth() {
  const value = use(Context)
  if (!value) {
    throw new Error('useAuth must be wrapped in a <AuthProvider />')
  }

  return value
}

function useSignInMutation() {
  const { signIn } = useMobileWallet()

  return useMutation({
    mutationFn: async () =>
      await signIn({
        uri: AppConfig.uri,
      }),
  })
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { disconnect } = useMobileWallet()
  const { accounts, isLoading } = useAuthorization()
  const signInMutation = useSignInMutation()
  const { getOrCreateAuthToken } = useAuthManager()
  const [token, setToken] = useState<string | null>(null);

  console.log('auth provider loaded');

  // useEffect(() => {
  //   fetchToken();
  // }, [accounts])


  // const fetchToken = async () => {
  //   if (accounts && accounts[0].address) {
  //     try {
  //       const walletAddress = accounts[0].publicKey;
  //       const jwtToken = await getOrCreateAuthToken(walletAddress);
  //       setToken(jwtToken);
  //       console.log('Fetched JWT token:', jwtToken);
  //     } catch (error) {
  //       logger.error('AuthProvider', 'Error fetching JWT token', error);
  //     }
  //   } else {
  //     setToken(null)
  //   }
  // }

  const value: AuthState = useMemo(
    () => ({
      signIn: async () => {
        console.log('ca,ereher');
        const account = await signInMutation.mutateAsync()

        try {
          const walletAddress = account.publicKey.toBase58();
          const jwtToken = await getOrCreateAuthToken(walletAddress);
          setToken(jwtToken);
        } catch (error) {
          logger.error('AuthProvider', 'Error fetching JWT token', error);
        }
        return account
      },
      signOut: async () => {

        try {
          await removeFromSecureStore(KeyType.JWT)
          await disconnect()

          setToken(null)
        } catch (error) {
          console.error('error in signout:', error)
        }
      },
      isAuthenticated: (accounts?.length ?? 0) > 0,
      isLoading: signInMutation.isPending || isLoading,
      token
    }),
    [accounts, disconnect, signInMutation, isLoading, token],
  )

  return <Context value={value}>{children}</Context>
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { ClusterProvider } from './cluster/cluster-provider'
import { SolanaProvider } from '@/components/solana/solana-provider'
import { AppTheme } from '@/components/app-theme'
import { AuthProvider } from '@/components/auth/auth-provider'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

const queryClient = new QueryClient()

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <AppTheme>
          <QueryClientProvider client={queryClient}>
            <ClusterProvider>
              <SolanaProvider>
                <AuthProvider>{children}</AuthProvider>
              </SolanaProvider>
            </ClusterProvider>
          </QueryClientProvider>
        </AppTheme>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

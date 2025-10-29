import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { ClusterProvider } from './cluster/cluster-provider'
import { SolanaProvider } from '@/components/solana/solana-provider'
import { AppTheme } from '@/components/app-theme'
import { AuthProvider } from '@/components/auth/auth-provider'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 429 (rate limit) errors
        if (error?.response?.status === 429 || error?.message?.includes('429')) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations on 429 errors
        if (error?.response?.status === 429 || error?.message?.includes('429')) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
})

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

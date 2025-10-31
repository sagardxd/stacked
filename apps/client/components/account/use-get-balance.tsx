import { PublicKey } from '@solana/web3.js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useConnection } from '../solana/solana-provider'

export function useGetBalanceQueryKey({ address, endpoint }: { address: PublicKey; endpoint: string }) {
  return ['get-balance', { endpoint, address }]
}

export function useGetBalance({ address }: { address: PublicKey }) {
  const connection = useConnection()
  const queryKey = useGetBalanceQueryKey({ address, endpoint: connection.rpcEndpoint })

  return useQuery({
    queryKey,
    queryFn: () => connection.getBalance(address),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
  })
}

export function useGetBalanceInvalidate({ address }: { address: PublicKey }) {
  const connection = useConnection()
  const queryKey = useGetBalanceQueryKey({ address, endpoint: connection.rpcEndpoint })
  const client = useQueryClient()

  return () => client.invalidateQueries({ queryKey })
}

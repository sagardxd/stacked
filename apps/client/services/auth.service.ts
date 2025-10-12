import { logger } from "@/utils/logger.service"
import apiCaller from "./axios.service"
import { verifyNonceInput, verifyNonceResponse } from "@/types/auth.types"

export const getNonce = async (address: string): Promise<string | null> => {
    console.log('📡 Getting nonce for address:', address)
    try {
        const response = await apiCaller.get<any>(`/auth/nonce?walletPubkey=${address}`)
        console.log('✓ nonce API response:', response.data)

        return response.data
    } catch (error) {
        console.error('❌ Error getting nonce:', error)
        logger.error('getNonce', 'error getting nonce', error)
        return null
    }
}

export const verifyNonce = async ({ walletPubkey, signature, message }: verifyNonceInput) => {
    console.log('📡 Verifying nonce with:', { walletPubkey, message, signature: signature})
    try {
        console.log('tring to send request');
        const response = await apiCaller.post<verifyNonceResponse>(`/auth/verify`, {
            message,
            signature,
            walletPubkey
        })
        console.log('✓ Verify API response:', response)
        return response.data
    } catch (error) {
        console.error('❌ Error verifying nonce:', error)
        logger.error('verifyNonce', 'error verifying nonce', error)
        throw error
    }
}
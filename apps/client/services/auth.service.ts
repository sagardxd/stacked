import { logger } from "@/utils/logger.service"
import apiCaller from "./axios.service"
import { verifyNonceInput, verifyNonceResponse } from "@/types/auth.types";

export const getNonce = async () => {
    try {
        const response = await apiCaller.get(`/auth/nonce?wallet`);
        return response.data
    } catch (error) {
        logger.error('getNonce', 'error getting nonce', error)
    }
}

export const verifyNonce = async ({ message, signature, walletPubkey }: verifyNonceInput) => {
    try {
        const response = await apiCaller.post<verifyNonceResponse>(`/auth/verify`, {
            message,
            signature,
            walletPubkey
        })
        return response.data
    } catch (error) {
        logger.error('verifyNonce', 'error verifying nonce', error)

    }
}
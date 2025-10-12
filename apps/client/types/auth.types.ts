export type verifyNonceInput = {
    walletPubkey: string
    signature: string
    message: string
} 

export type verifyNonceResponse = {
    id: string
    walletPubkey: string
    token: string
    email: string
    username: string | null
    avatarUrl: string | null
    createdAt: string | null
    updatedAt: string
  }
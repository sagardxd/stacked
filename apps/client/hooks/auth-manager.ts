import { getNonce, verifyNonce } from "@/services/auth.service";
import { getFromSecureStore, saveToSecureStore } from "@/store/secure-store";
import { KeyType } from "@/types/keys.types";
import { logger } from "@/utils/logger.service";
import { useWalletUi } from "@/components/solana/use-wallet-ui";
import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";

export async function signWalletMessage(signMessage: (msg: Uint8Array) => Promise<Uint8Array>, message: string) {
    const encoded = new TextEncoder().encode(message);
    const signature = await signMessage(encoded)
    // If it's already string (like base64)
    if (typeof signature === "string") return signature;

    // Otherwise, encode properly
    return bs58.encode(signature);
}

export const useAuthManager = () => {
    const { signMessage } = useWalletUi();

    const getOrCreateAuthToken = async (walletAddress: string) => {

        console.log('walet address ', walletAddress);
        try {
            const existingToken = await getFromSecureStore(KeyType.JWT);
            console.log('existingToken', existingToken);

            if (existingToken) return existingToken;


            const nonce = await getNonce(walletAddress);
            if (!nonce) throw new Error("Failed to get nonce");

            const signature = await signWalletMessage(signMessage, nonce);
            const verifyInput = { walletPubkey: walletAddress, message: nonce, signature };

            const verifyData = await verifyNonce(verifyInput);

            console.log('verify data fromt he auth manager', verifyData);
            const jwtToken = verifyData?.token!

            if (!jwtToken) throw new Error("No token returned from verifyNonce");

            await saveToSecureStore(KeyType.JWT, jwtToken);
            return jwtToken;
        } catch (error) {
            logger.error("getOrCreateAuthToken", "Error during auth token creation", error);
            return null;
        }
    };

    return { getOrCreateAuthToken };
};

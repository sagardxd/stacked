import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import { SignInPayload } from '@solana-mobile/mobile-wallet-adapter-protocol'
import { Transaction, TransactionSignature, VersionedTransaction } from '@solana/web3.js'
import { useCallback, useMemo } from 'react'
import { Account, useAuthorization } from './use-authorization'
import { getNonce, verifyNonce } from '@/services/auth.service'
import bs58 from 'bs58';

export function useMobileWallet() {
  const { authorizeSessionWithSignIn, authorizeSession, deauthorizeSessions } = useAuthorization()

  const connect = useCallback(async (): Promise<Account> => {
    return await transact(async (wallet) => {
      return await authorizeSession(wallet)
    })
  }, [authorizeSession])

  const signIn = useCallback(
    async (signInPayload: SignInPayload): Promise<Account> => {
    console.log('insdie sign')

      return await transact(async (wallet) => {
        return await authorizeSessionWithSignIn(wallet, signInPayload)
      })
    },
    [authorizeSessionWithSignIn],
  )

  const disconnect = useCallback(async (): Promise<void> => {
     console.log('de authorizing the token');
    await deauthorizeSessions()
  }, [deauthorizeSessions])

  const signAndSendTransaction = useCallback(
    async (transaction: Transaction | VersionedTransaction, minContextSlot: number): Promise<TransactionSignature> => {
      return await transact(async (wallet) => {
        await authorizeSession(wallet)
        const signatures = await wallet.signAndSendTransactions({
          transactions: [transaction],
          minContextSlot,
        })
        return signatures[0]
      })
    },
    [authorizeSession],
  )

  const signMessage = useCallback(
    async (message: Uint8Array): Promise<Uint8Array> => {
      return await transact(async (wallet) => {
        const authResult = await authorizeSession(wallet)
        console.log('authresult ', authResult.address);
        const signedMessages = await wallet.signMessages({
          addresses: [authResult.address],
          payloads: [message],
        })
        console.log('singned msg', signedMessages);
        return signedMessages[0]
      })
    },
    [authorizeSession],
  )

const signJwt = useCallback(async () => {
  console.log('=== STARTING signJwt ===');
  try {
    return await transact(async (wallet) => {
      try {
        // Step 1: Authorize session (opens Phantom for approval)
        console.log('Step 1: Authorizing session...');
        const account = await authorizeSession(wallet);
        console.log('✓ Authorized! Account:', account.publicKey.toBase58());

        // Step 2: Get nonce from backend
        console.log('Step 2: Fetching nonce from backend...');
        const nonceResponse = await getNonce(account.publicKey.toBase58());
        if (!nonceResponse) {
          throw new Error('Failed to get nonce from backend');
        }
        console.log('✓ Nonce received:', nonceResponse);

        // Step 3: Sign the nonce with wallet
        // ⚠️ IMPORTANT: Use wallet.signMessages() directly, NOT the signMessage function!
        console.log('Step 3: Signing message with wallet...');
        const messageBytes = new TextEncoder().encode(nonceResponse);

        console.log("message bytes ban gai ");
        
        const signatureBytes = await wallet.signMessages({
          addresses: [account.address],
          payloads: [messageBytes],
        });

        console.log('got the signature');
        
        const signatureBase58 = bs58.encode(signatureBytes[0]);
        console.log('✓ Message signed! Signature:', signatureBase58.substring(0, 20) + '...');

        // Step 4: Verify signature with backend
        console.log('Step 4: Verifying signature with backend...');
        const verifyResponse = await verifyNonce({
          walletPubkey: account.publicKey.toBase58(), // Use publicKey string, not address
          signature: signatureBase58,
          message: nonceResponse,
        });

        console.log('✓ Signature verified!', verifyResponse);
        console.log('=== signJwt COMPLETE ===');

        return account;
      } catch (innerErr) {
        console.error('❌ Error inside transact callback:', innerErr);
        throw innerErr;
      }
    });
  } catch (err) {
    console.error('❌ Error during signJwt:', err);
    throw err;
  }
}, [authorizeSession]);


  return useMemo(
    () => ({
      connect,
      signIn,
      disconnect,
      signAndSendTransaction,
      signMessage,
      signJwt
    }),
    [connect, disconnect, signAndSendTransaction, signIn, signMessage, signJwt],
  )
}

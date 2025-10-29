import React, { useMemo, useEffect } from 'react';
import { StakingCard } from './StakingCard';
import { SipCard } from './SipCard';
import { SipAsset, StakingAsset, Asset } from '@/types/asset.types';
import { useEscrow } from '@/components/escrow/use-escrow';
import { lamportsToSol } from '@/utils/lamports-to-sol';
import { useStakingStore } from '@/store/staking.store';
import { useAssetStore } from '@/store/asset.store';

interface StakingCardListProps {
    onCardPress?: (asset: StakingAsset | SipAsset) => void;
}

export const StakingCardList: React.FC<StakingCardListProps> = ({ onCardPress }) => {
    const { escrowAccounts } = useEscrow();
    const { setPositions, setLoading, updateTotalBalance } = useStakingStore();
    const getAsset = useAssetStore((state) => state.getAsset);

    // Set loading state
    useEffect(() => {
        setLoading(escrowAccounts.isLoading || escrowAccounts.isFetching);
    }, [escrowAccounts.isLoading, escrowAccounts.isFetching, setLoading]);

    // Convert escrow data array to StakingAsset format
    const lockedEscrowAssets = useMemo((): StakingAsset[] => {
        if (!escrowAccounts?.data || escrowAccounts.data.length === 0) {
            return [];
        }

        return escrowAccounts.data
            .filter((escrow) => escrow.amount.toNumber() > 0)
            .map((escrow): StakingAsset => {
                const unlockTimestamp = Number(escrow.unlockTime);
                const unlockDate = new Date(unlockTimestamp * 1000);
                const now = Date.now();
                const unlockTimeMs = unlockDate.getTime();
                
                // Calculate time remaining in seconds
                const timeRemainingSeconds = Math.max(0, Math.floor((unlockTimeMs - now) / 1000));
                const timeRemainingDays = Math.ceil(timeRemainingSeconds / (3600 * 24));
                
                const estimatedTotalDays = Math.max(365, timeRemainingDays + 30); // At least what's left + buffer
                
                // Progress = (totalDuration - timeRemaining) / totalDuration
                const elapsedDays = estimatedTotalDays - timeRemainingDays;
                const progress = Math.max(0, Math.min(1, elapsedDays / estimatedTotalDays));

                // Format maturity date
                const maturityDateStr = unlockDate.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                // Convert amount from lamports to SOL
                const stakedAmountSol = lamportsToSol(escrow.amount);

                return {
                    id: `locked-escrow-${escrow.escrowId.toString()}`,
                    name: 'Locked SOL',
                    symbol: 'SOL',
                    logo: 'solana',
                    maturityDate: maturityDateStr,
                    stakedAmount: stakedAmountSol, 
                    timeLeft: timeRemainingDays,
                    totalDuration: estimatedTotalDays,
                    progress: progress,
                    color: '#50C4AC',
                    imageLink: 'https://res.cloudinary.com/dpk1nbczk/image/upload/v1759233401/solana-logo_s566xz.png'
                };
            });
    }, [escrowAccounts?.data]);

    // Update positions in store when lockedEscrowAssets changes
    useEffect(() => {
        const storePositions = lockedEscrowAssets.map((asset) => ({
            id: asset.id,
            symbol: asset.symbol,
            stakedAmount: asset.stakedAmount || 0,
        }));
        setPositions(storePositions);
    }, [lockedEscrowAssets, setPositions]);

    // Get asset prices from store to watch for changes
    const assets = useAssetStore((state) => state.assets);

    // Calculate and update total balance when positions or asset prices change
    useEffect(() => {
        if (lockedEscrowAssets.length === 0) {
            updateTotalBalance(new Map());
            return;
        }

        // Get SOL asset price
        const solAsset = getAsset(Asset.SOL);
        const solPrice = solAsset ? solAsset.currPrice / Math.pow(10, solAsset.decimal) : 0;

        // Create price map
        const assetPrices = new Map<string, number>();
        assetPrices.set('SOL', solPrice);

        // Update total balance
        updateTotalBalance(assetPrices);
    }, [lockedEscrowAssets, assets, getAsset, updateTotalBalance]);

    // Combine locked escrows with demo assets
    const allAssets = useMemo(() => {
        const assets: (StakingAsset | SipAsset)[] = [];
        
        // Add all locked escrows
        if (lockedEscrowAssets.length > 0) {
            assets.push(...lockedEscrowAssets);
        }
        
        return assets;
    }, [lockedEscrowAssets]);

    return (
        <>
            {allAssets.map((asset: StakingAsset | SipAsset) => (
                'maturityDate' in asset ? (
                    <StakingCard
                        key={asset.id}
                        asset={asset}
                        onPress={() => onCardPress?.(asset)}
                    />
                ) : (
                    <SipCard
                        key={asset.id}
                        asset={asset}
                        onPress={() => onCardPress?.(asset)}
                    />
                )
            ))}
        </>
    );
};

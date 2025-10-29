import React, { useMemo } from 'react';
import { StakingCard } from './StakingCard';
import { SipCard } from './SipCard';
import { SipAsset, StakingAsset } from '@/types/asset.types';
import { useEscrow } from '@/components/escrow/use-escrow';
import { lamportsToSol } from '@/utils/lamports-to-sol';

// Demo data (mixed staking + sip

interface StakingCardListProps {
    onCardPress?: (asset: StakingAsset | SipAsset) => void;
}

export const StakingCardList: React.FC<StakingCardListProps> = ({ onCardPress }) => {
    const { escrowAccounts } = useEscrow();

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
                
                // Estimate total duration (assuming lock was for ~1 year, but we'll use a reasonable estimate)
                // Since we don't have creation time, we'll estimate based on typical lock duration
                // Using a default of 365 days as estimate if we can't determine the actual duration
                const estimatedTotalDays = Math.max(365, timeRemainingDays + 30); // At least what's left + buffer
                
                // Calculate progress: how much time has passed vs total estimated duration
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
                    // currentAPY is omitted (optional) for locked assets
                    stakedAmount: stakedAmountSol, // Show staked amount instead of APY
                    timeLeft: timeRemainingDays,
                    totalDuration: estimatedTotalDays,
                    progress: progress,
                    color: '#50C4AC',
                    imageLink: 'https://res.cloudinary.com/dpk1nbczk/image/upload/v1759233401/solana-logo_s566xz.png'
                };
            });
    }, [escrowAccounts?.data]);

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

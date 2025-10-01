import React from 'react';
import { StyleSheet } from 'react-native';
import { StakingCard } from './StakingCard';
import { SipCard } from './SipCard';
import { SipAsset, StakingAsset } from '@/types/asset.types';

// Demo data (mixed staking + sip)
const demoStakingAssets: (StakingAsset | SipAsset)[] =  [
    {
        id: '1',
        name: 'Solana',
        symbol: 'SOL',
        logo: 'solana',
        maturityDate: '10 December 2025',
        currentAPY: 11.30,
        timeLeft: 71,
        totalDuration: 90,
        progress: 0.21,// 19 days out of 90
        color: '#50C4AC',
        imageLink: 'https://res.cloudinary.com/dpk1nbczk/image/upload/v1759233401/solana-logo_s566xz.png'
    },
    {
        id: "sip-sol-001",
        name: "Solana",
        symbol: "SOL",
        logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
        amountPerInstallment: 10, // $100 each month
        frequency: "monthly",
        startDate: "2025-01-01T00:00:00Z",
        nextInstallmentDate: "2025-10-31T00:00:00Z",
        investedAmount: 900, // $100 x 9 months
        currentValue: 1200, // Value has grown
        returnsPercentage: 33.3,
        color: "#8C6DFA",
        imageLink: "https://res.cloudinary.com/dpk1nbczk/image/upload/v1759233401/solana-logo_s566xz.png"
    }
];

interface StakingCardListProps {
    onCardPress?: (asset: StakingAsset | SipAsset) => void;
}

export const StakingCardList: React.FC<StakingCardListProps> = ({ onCardPress }) => {
    return (
        demoStakingAssets.map((asset: StakingAsset | SipAsset) => (
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
        ))
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 8,
    },
});

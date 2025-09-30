import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { StakingCard, StakingAsset } from './StakingCard';

// Demo data
const demoStakingAssets: StakingAsset[] = [
    {
        id: '1',
        name: 'hyloSOL',
        symbol: 'SOL',
        logo: 'solana',
        maturityDate: '10 December 2025',
        currentAPY: 11.30,
        timeLeft: 71,
        totalDuration: 90,
        progress: 0.21, // 19 days out of 90
        color: '#7B2FF7',
    },
    {
        id: '2',
        name: 'stakedETH',
        symbol: 'ETH',
        logo: 'ethereum',
        maturityDate: '15 January 2026',
        currentAPY: 8.75,
        timeLeft: 107,
        totalDuration: 120,
        progress: 0.11, // 13 days out of 120
        color: '#22D3EE',
    },
    {
        id: '3',
        name: 'liquidBTC',
        symbol: 'BTC',
        logo: 'bitcoin',
        maturityDate: '20 February 2026',
        currentAPY: 6.50,
        timeLeft: 143,
        totalDuration: 180,
        progress: 0.21, // 37 days out of 180
        color: '#F59E0B',
    },
];

interface StakingCardListProps {
    onCardPress?: (asset: StakingAsset) => void;
}

export const StakingCardList: React.FC<StakingCardListProps> = ({ onCardPress }) => {
    return (
        demoStakingAssets.map((asset) => (
            <StakingCard
                key={asset.id}
                asset={asset}
                onPress={() => onCardPress?.(asset)}
            />
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

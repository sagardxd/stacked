import { create } from 'zustand';

interface StakingPosition {
    id: string;
    symbol: string;
    stakedAmount: number;
}

interface StakingStore {
    positions: StakingPosition[];
    isLoading: boolean;
    totalBalance: number; // Total balance in USD
    setPositions: (positions: StakingPosition[]) => void;
    setLoading: (loading: boolean) => void;
    updateTotalBalance: (assetPrices: Map<string, number>) => void;
}

export const useStakingStore = create<StakingStore>((set, get) => ({
    positions: [],
    isLoading: false,
    totalBalance: 0,
    setPositions: (positions) => {
        set({ positions });
    },
    setLoading: (loading) => {
        set({ isLoading: loading });
    },
    updateTotalBalance: (assetPrices) => {
        const { positions } = get();
        let total = 0;
        
        positions.forEach((position) => {
            const price = assetPrices.get(position.symbol);
            if (price !== undefined && price > 0) {
                total += position.stakedAmount * price;
            }
        });
        
        set({ totalBalance: total });
    },
}));


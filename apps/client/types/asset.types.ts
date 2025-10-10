export enum Asset {
    SOL = "SOL"
}

export interface AssetData {
    asset: Asset,
    currPrice: number
    decimal: number
}

export interface WSData {
    price_updates: AssetData[]
}

interface PortfolioAsset {
    id: string;
    name: string;
    symbol: string;
    logo: string;
    color: string;
    imageLink: string
}

export interface StakingAsset extends PortfolioAsset {
    maturityDate: string;
    currentAPY: number;
    timeLeft: number;
    totalDuration: number;
    progress: number;
}

export interface SipAsset extends PortfolioAsset {
    amountPerInstallment: number;
    frequency: "daily" | "weekly" | "monthly";
    startDate: string;
    nextInstallmentDate: string;
    investedAmount: number;
    currentValue: number;
    returnsPercentage: number;
}


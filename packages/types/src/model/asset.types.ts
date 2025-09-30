export enum Asset {
    BTC = "BTC",
    ETH = "ETH",
    SOL = "SOL"
}


export interface AssetData {
    asset: Asset,
    bidPrice: number
    askPrice: number
    decimal: number
}

export interface WSData {
    price_updates: AssetData[]
}

export interface SupportedAssets {
    assets: SupportedAsset[]
}

interface SupportedAsset {
    symbol: string
    name: string
    imageUrl: string
}

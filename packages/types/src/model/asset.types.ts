export enum Asset {
    SOL = "SOL",
}

export interface AssetData {
    asset: Asset,
    currPrice: number
    decimal: number
}

export interface WSData {
    price_updates: AssetData[]
}
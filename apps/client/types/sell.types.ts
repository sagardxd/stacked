import { StakingAsset } from "./asset.types";

export interface AssetForSale extends StakingAsset {
    sellAmount: number
}
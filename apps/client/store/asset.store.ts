import { Asset, AssetData } from '@/types/asset.types'
import { create } from 'zustand'

interface AssetStore {
    assets: AssetData[]
    setAssets: (assets: AssetData[]) => void
    getAsset: (asset: Asset) => AssetData | null
}

export const useAssetStore = create<AssetStore>((set, get) => ({
    assets: [],
    setAssets: (newAssets) => set({ assets: newAssets }),
    getAsset: (asset) => {
        const assets = get().assets ?? []
        return assets.find((a: AssetData) => a.asset === asset) || null
    }
}))


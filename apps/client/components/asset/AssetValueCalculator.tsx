import React from 'react'
import { AppText } from '../app-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useAssetStore } from '@/store/asset.store'
import { Asset } from '@/types/asset.types'

type AssetValueCalculatorProps = {
    volume: string
}

const AssetValueCalculator = ({volume}: AssetValueCalculatorProps) => {
    const text = useThemeColor({}, 'text');

    const assetPrice = useAssetStore((state) => state.getAsset(Asset.SOL))
    if (!assetPrice) return null
    
  return (
    <AppText type='caption' style={[{ color: text + '60' }]}>
    ≈ $ {volume ? ((parseFloat(volume) * (assetPrice.currPrice / Math.pow(10, assetPrice.decimal))).toFixed(2)): '0.00'} USD
  </AppText>
  )
}

export default AssetValueCalculator
  import { StyleSheet } from 'react-native'
  import React from 'react'
  import { Image } from 'expo-image'
  import { Asset } from '@/types/asset.types'

  const assetIcons: Record<Asset, any> = {
    [Asset.SOL]: require('@/assets/images/icons/solana-logo.png'),
  }

  interface AssetImageProps {
    asset: Asset,
    width?: number,
    height?: number
  }

  const AssetImage: React.FC<AssetImageProps> = ({ asset, width = 24, height = 24}) => {
    const source = assetIcons[asset]

    if (!source) return null

    return <Image source={source} style={[{width , height}]} />
  }

  export default AssetImage

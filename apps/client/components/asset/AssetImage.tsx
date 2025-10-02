import { StyleSheet } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { Asset } from '@/types/asset.types'

const assetIcons: Record<Asset, any> = {
  [Asset.SOL]: require('@/assets/images/icons/solana-logo.png'),
}

interface AssetImageProps {
  asset: Asset
}

const AssetImage: React.FC<AssetImageProps> = ({ asset }) => {
  const source = assetIcons[asset]

  if (!source) return null

  return <Image source={source} style={styles.logoContainer} />
}

const styles = StyleSheet.create({
  logoContainer: {
    width: 24,
    height: 24,
  },
})

export default AssetImage

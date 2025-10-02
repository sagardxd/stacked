import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { AppView } from '../app-view'
import { AppText } from '../app-text'
import { Asset } from '@/types/asset.types'
import { useAssetStore } from '@/store/asset.store'

interface AssetPrice {
    asset: Asset
}

const AssetPrice:React.FC<AssetPrice> = ({asset}) => {

    const assetPrice = useAssetStore((state) => state.getAsset(asset));
    if (!assetPrice ) return <View><Text>not found</Text></View>

  return (
      <AppText type='subheading'>${(assetPrice.currPrice / Math.pow(10, assetPrice.decimal)).toLocaleString()}</AppText>
  )
}

export default AssetPrice
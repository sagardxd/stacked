import { View, ActivityIndicator } from 'react-native'
import React from 'react'
import { AppText } from '../app-text'
import { Asset } from '@/types/asset.types'
import { useAssetStore } from '@/store/asset.store'
import { useThemeColor } from '@/hooks/use-theme-color'

interface AssetPrice {
    asset: Asset
}

const AssetPrice:React.FC<AssetPrice> = ({asset}) => {
    const assetPrice = useAssetStore((state) => state.getAsset(asset));
    const accent = useThemeColor({}, 'accent');
    
    if (!assetPrice) {
        return (
            <View style={{ paddingVertical: 10 }}>
                <ActivityIndicator size="small" color={accent} />
            </View>
        );
    }

    return (
        <AppText type='subheading'>${(assetPrice.currPrice / Math.pow(10, assetPrice.decimal)).toLocaleString()}</AppText>
    )
}

export default AssetPrice
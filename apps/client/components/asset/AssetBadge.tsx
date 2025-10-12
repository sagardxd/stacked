import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useAssetStore } from '@/store/asset.store';
import { Asset } from '@/types/asset.types';
import { AppView } from '../app-view';
import { AppText } from '../app-text';
import { useThemeColor } from '@/hooks/use-theme-color';

const AssetBadge = () => {
    const assetPrice = useAssetStore((state) => state.getAsset(Asset.SOL));
    const border = useThemeColor({}, 'border');
    const text = useThemeColor({}, 'text');

    if (!assetPrice) return null;

    return (
        <AppView style={[styles.priceBadge, { borderColor: border }]}>
            <AppText type='caption' style={{ color: text }}>
                SOL = ${(assetPrice.currPrice / Math.pow(10, assetPrice.decimal)).toFixed(2)}
            </AppText>
        </AppView>
    )
}

const styles = StyleSheet.create({
    priceBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1
    },
})

export default AssetBadge
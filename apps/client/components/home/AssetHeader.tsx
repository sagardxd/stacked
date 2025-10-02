import React from 'react'
import { AppView } from '../app-view'
import { StyleSheet, View } from 'react-native'
import AssetImage from '@/components/asset/AssetImage'
import { Asset } from '@/types/asset.types'
import AssetPrice from '@/components/asset/AssetPrice'
import { AppText } from '../app-text'

interface AssetHeaderProps {
    asset: Asset
}

const AssetHeader: React.FC<AssetHeaderProps> = ({ asset }) => {
    return (
        <AppView style={styles.headerContainer}>
            <View style={styles.labelContainer}>
                <AssetImage asset={asset} />
                <AppText type='medium'>Solana</AppText>
            </View>
            <AssetPrice asset={asset} />
        </AppView>
    )
}
    
const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 10
    },
    labelContainer: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

})

export default AssetHeader
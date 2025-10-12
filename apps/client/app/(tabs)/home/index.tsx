import React, { useEffect, useState, useCallback } from 'react'
import { AppPage } from '@/components/app-page';
import AssetHeader from '@/components/home/AssetHeader';
import { ScrollView, StyleSheet, View } from 'react-native';
import ValidatorList from '@/components/validators/ValidatorList';
import AssetChart from '@/components/chart/AssetChart';
import { Asset } from '@/types/asset.types';

const Home = () => {

    return (
        <AppPage>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AssetHeader asset={Asset.SOL} />
                <View style={styles.container}>
                    <AssetChart asset={Asset.SOL} />
                    <ValidatorList />
                </View>
            </ScrollView>
        </AppPage>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        gap: 20,
        paddingBottom: 50
    }
})

export default Home

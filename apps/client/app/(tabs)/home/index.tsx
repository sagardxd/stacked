import React from 'react'
import { AppPage } from '@/components/app-page';
import AssetHeader from '@/components/asset/AssetHeader';
import { ScrollView, StyleSheet, View } from 'react-native';
import AssetChart from '@/components/chart/AssetChart';
import { Asset } from '@/types/asset.types';
import { AppButton } from '@/components/app-button';
import { AppView } from '@/components/app-view';
import { useRouter } from 'expo-router';

const Home = () => {
    const router = useRouter();

    return (
        <AppPage>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AssetHeader asset={Asset.SOL} />
                <View style={styles.container}>
                    <AssetChart asset={Asset.SOL} />
                    <AppView style={styles.buttonContainer}>
                        <AppButton title='Lock Sol' onPress={() => router.push({ pathname: '/(tabs)/home/lock' })} type='secondary' buttonStyle={{ flex: 1 }} />
                    </AppView>
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
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        bottom: 0,
        paddingBottom: 30,
    }
})

export default Home

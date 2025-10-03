import React, { useEffect, useState } from 'react'
import { Asset, AssetData, WSData } from '@/types/asset.types';
import { useAssetStore } from '@/store/asset.store';
import { logger } from '@/utils/logger.service';
import { AppPage } from '@/components/app-page';
import AssetHeader from '@/components/home/AssetHeader';
import Graph from '@/components/chart/Wallet';
import { ScrollView, StyleSheet, View } from 'react-native';
import ValidatorList from '@/components/validators/ValidatorList';

const Home = () => {
    const [assets, setAssets] = useState<AssetData[]>([])
    const [isClient, setIsClient] = useState(false);
    const { setAssets: SetAssetStore } = useAssetStore()

    useEffect(() => {
        if (isClient) return;

        let socket: WebSocket | null = null;

        try {
            socket = new WebSocket(`ws://192.168.1.197:8003`);
            logger.info('Attempting WebSocket connection...');

            socket.onopen = () => {
                logger.info('Connected to WebSocket backend');
            }

            socket.onmessage = (event) => {
                const response = JSON.parse(event.data) as WSData
                console.log(response.price_updates)
                setAssets(response.price_updates)
                SetAssetStore(response.price_updates)
            }
            socket.onerror = (error) => {
                logger.error('WebSocket error', '', error);
            }

            socket.onclose = (event) => {
                logger.error('WebSocket connection closed:', (event.code).toString(), event.reason);
            }

        } catch (error) {
            logger.error('home uef', 'Error creating WebSocket:', error);
        }

        // Cleanup function
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [isClient]);

    return (
        <AppPage>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AssetHeader asset={Asset.SOL} />
                <View style={styles.chartContainer}>
                    <Graph />
                </View>
                <ValidatorList />
            </ScrollView>
        </AppPage>
    )
}

const styles = StyleSheet.create({
    chartContainer: {
        borderRadius: 28,
    }
})

export default Home

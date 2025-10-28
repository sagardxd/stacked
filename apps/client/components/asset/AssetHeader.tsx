import React, { useEffect, useState } from 'react'
import { AppView } from '../app-view'
import { Asset, AssetData, WSData } from '@/types/asset.types';
import { StyleSheet, View } from 'react-native'
import AssetImage from '@/components/asset/AssetImage'
import { useAssetStore } from '@/store/asset.store';
import AssetPrice from '@/components/asset/AssetPrice'
import { AppText } from '../app-text'
import { logger } from '@/utils/logger.service';


interface AssetHeaderProps {
    asset: Asset
}

const AssetHeader: React.FC<AssetHeaderProps> = ({ asset }) => {
    const [assets, setAssets] = useState<AssetData[]>([])
    const [isClient, setIsClient] = useState(false);
    const { setAssets: SetAssetStore } = useAssetStore()

    // Set client flag once on mount
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        let socket: WebSocket | null = null;

        const connectWebSocket = () => {
            try {
                socket = new WebSocket('ws://72ab17b6906d.ngrok-free.app');
                logger.info('Attempting WebSocket connection...');

                socket.onopen = () => {
                    logger.info('Connected to WebSocket backend');
                }

                socket.onmessage = (event) => {
                    const response = JSON.parse(event.data) as WSData
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
        };

        connectWebSocket();

        // Cleanup function
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [isClient, SetAssetStore]);

    return (
        <AppView style={styles.headerContainer}>
            <View style={styles.labelContainer}>
                <AssetImage asset={asset} />
                <AppText type='medium'>Solana</AppText>
            </View>
            <AppView style={styles.assetPriceContainer}>
                <AssetPrice asset={asset} />
            </AppView>
        </AppView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 10,
    },
    labelContainer: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    assetPriceContainer: {
        paddingVertical: 10
    }

})

export default AssetHeader
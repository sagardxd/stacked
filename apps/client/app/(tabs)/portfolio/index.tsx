import React, { useEffect, useState } from 'react'
import { AppText } from '@/components/app-text'
import { ScrollView, StyleSheet, View } from 'react-native'
import UserBalance from '@/components/portfolio/UserBalance'
import { BalanceRing } from '@/components/portfolio/BalanceRing'
import { AppView } from '@/components/app-view'
import { StakingCardList } from '@/components/portfolio/StakingCardList'
import { AppPage } from '@/components/app-page'
import { AssetData, SipAsset, StakingAsset, WSData } from '@/types/asset.types'
import { logger } from '@/utils/logger.service'
import { useAssetStore } from '@/store/asset.store'

const Portfolio = () => {
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

  const handleCardPress = (asset: StakingAsset | SipAsset) => {
    console.log('Pressed staking card:', asset.name);
  };

  return (
    <AppPage>
      <AppText type='medium' >Portfolio</AppText>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <AppView style={styles.balanceRingContainer}>
          <UserBalance balance={10000} />
          <BalanceRing
            size={300}
            strokeWidth={19}
            amount="$1560.60"
            subtitle="+0.64% ($9.98)"
            segments={[
              { value: 0.6, color: '#8C6DFA', label: "Sol" },
              { value: 0.4, color: '#50C4AC', label: "Eth" },
            ]}
            gapDegrees={9}
          />
        </AppView>
        <AppText type='medium' style={styles.sectionTitle}>Staking Positions</AppText>
        <StakingCardList onCardPress={handleCardPress} />

      </ScrollView>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  balanceRingContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  container: {
  },
  contentContainer: {
    paddingVertical: 8,
  },
})

export default Portfolio

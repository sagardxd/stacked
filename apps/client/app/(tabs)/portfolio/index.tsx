import React from 'react'
import { AppText } from '@/components/app-text'
import { ScrollView, StyleSheet, View } from 'react-native'
import UserBalance from '@/components/portfolio/UserBalance'
import { BalanceRing } from '@/components/portfolio/BalanceRing'
import { AppView } from '@/components/app-view'
import { StakingCardList } from '@/components/portfolio/StakingCardList'
import { StakingAsset } from '@/components/portfolio/StakingCard'
import { AppPage } from '@/components/app-page'

const Portfolio = () => {
  const handleCardPress = (asset: StakingAsset) => {
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
              { value: 0.6, color: '#9A5BFF', label: "Sol" },
              { value: 0.4, color: '#22D3EE', label: "Eth" },
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

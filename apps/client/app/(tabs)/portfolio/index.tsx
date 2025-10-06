import React, { useEffect, useState } from 'react'
import { AppText } from '@/components/app-text'
import { ScrollView, StyleSheet, View } from 'react-native'
import UserBalance from '@/components/portfolio/UserBalance'
import { BalanceRing } from '@/components/portfolio/BalanceRing'
import { AppView } from '@/components/app-view'
import { StakingCardList } from '@/components/portfolio/StakingCardList'
import { AppPage } from '@/components/app-page'
import { SipAsset, StakingAsset } from '@/types/asset.types'

const Portfolio = () => {


  const handleCardPress = (asset: StakingAsset | SipAsset) => {
    console.log('Pressed staking card:', asset.name);
  };

  return (
    <AppPage>
      <AppText type='medium' style={styles.header}>Portfolio</AppText>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <UserBalance balance={3000} />
        <AppView style={styles.balanceRingContainer}>
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
  header: {
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
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

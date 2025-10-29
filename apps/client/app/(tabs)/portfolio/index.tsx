import { AppText } from '@/components/app-text'
import { ScrollView, StyleSheet, View } from 'react-native'
import UserBalance from '@/components/portfolio/UserBalance'
import { StakingCardList } from '@/components/portfolio/StakingCardList'
import { AppPage } from '@/components/app-page'
import { SipAsset, StakingAsset } from '@/types/asset.types'
import { useRouter } from 'expo-router'

const Portfolio = () => {
  const router = useRouter();

  const handleCardPress = (asset: StakingAsset | SipAsset) => {
    router.push('/(tabs)/portfolio/asset/1')
  };

  return (
    <AppPage>
      <AppText type='medium' style={styles.header}>Portfolio</AppText>
      <UserBalance />
      <AppText type='button' style={styles.sectionTitle}>Staking Positions</AppText>

        <StakingCardList onCardPress={handleCardPress} />

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
  },
})

export default Portfolio

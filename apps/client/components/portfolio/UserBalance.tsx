import React, { useMemo } from 'react'
import { AppText } from '../app-text'
import { AppView } from '../app-view'
import { StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'
import { StaggeredCardNumber } from '../ui/staggered-card-number'
import { useStakingStore } from '@/store/staking.store'
import { useAssetStore } from '@/store/asset.store'
import { Asset } from '@/types/asset.types'

const UserBalance: React.FC = () => {
  const cardBg = useThemeColor({}, 'cardBg')
  
  // Get staking positions from store
  const positions = useStakingStore((state) => state.positions);
  
  // Get SOL asset price - computed directly to trigger updates
  const solPrice = useAssetStore((state) => {
    const assets = state.assets ?? [];
    const asset = assets.find((a) => a.asset === Asset.SOL);
    if (!asset) return 0;
    return asset.currPrice / Math.pow(10, asset.decimal);
  });

  // Calculate balance from positions and prices
  const balance = useMemo(() => {
    if (positions.length === 0 || solPrice <= 0) {
      return 0;
    }

    let total = 0;
    positions.forEach((position) => {
      if (position.symbol === 'SOL') {
        total += position.stakedAmount * solPrice;
      }
    });

    return total;
  }, [positions, solPrice]);

  const displayBalance = balance.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })

  return (
    <AppView style={[styles.balanceContainer, {backgroundColor: cardBg}]}>
      <StaggeredCardNumber balance={displayBalance} />
    </AppView>
  )
}

const styles = StyleSheet.create({
  balanceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 12,
    width: '100%',
    overflow: 'hidden',
  },
  balanceText: {
    fontWeight: '700'
  },
  balanceBody: {
    opacity: 1
  }
})

export default UserBalance

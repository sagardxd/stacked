import React, { useEffect, useState } from 'react'
import { AppText } from '../app-text'
import { AppView } from '../app-view'
import { StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'
import { StaggeredCardNumber } from '../ui/staggered-card-number'

interface UserBalanceProps {
  balance: number
}

const UserBalance: React.FC<UserBalanceProps> = ({ balance }) => {
  const accent = useThemeColor({}, 'accent')
  const cardBg = useThemeColor({}, 'cardBg')
  const [rawBalance, setRawBalance] = useState(balance);

  const displayBalance = rawBalance.toLocaleString('en-IN', {
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
  },
  balanceText: {
    fontWeight: '700'
  },
  balanceBody: {
    opacity: 1
  }

})


export default UserBalance
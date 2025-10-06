import React, { useEffect, useState } from 'react'
import { AppText } from '../app-text'
import { AppView } from '../app-view'
import { StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'

interface UserBalanceProps {
  balance: number
}

const UserBalance: React.FC<UserBalanceProps> = ({ balance }) => {
  const accent = useThemeColor({}, 'accent')
  const [rawBalance, setRawBalance] = useState(balance);

  const displayBalance = rawBalance.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })

  return (
    <AppView style={styles.balanceContainer}>
      <AppText type='subheading' style={styles.balanceText}>${displayBalance}</AppText>
      <AppText type='body' style={[styles.balanceBody, {color: accent}]}>+1.56% ($97.38) 
        <AppText type='body'> Overall</AppText>
      </AppText>
    </AppView>
  )
}

const styles = StyleSheet.create({
  balanceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  balanceText: {
    fontWeight: '700'
  },
  balanceBody: {
    opacity: 1
  }

})


export default UserBalance
import React, { useEffect, useState } from 'react'
import { AppText } from '../app-text'
import { AppView } from '../app-view'
import { StyleSheet } from 'react-native'

interface UserBalanceProps {
  balance: number
}

const UserBalance: React.FC<UserBalanceProps> = ({ balance }) => {
  const [rawBalance, setRawBalance] = useState(balance);

  const displayBalance = rawBalance.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })

  return (
    <AppView>
      <AppText type='subheading' style={styles.balanceText}>${displayBalance}</AppText>
    </AppView>
  )
}

const styles = StyleSheet.create({
  balanceText: {
    textAlign: 'center'
  }
})


export default UserBalance
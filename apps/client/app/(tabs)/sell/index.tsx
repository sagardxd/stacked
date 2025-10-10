import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { AssetForSale } from '@/types/sell.types'
import { AppPage } from '@/components/app-page'
import SaleCard from '@/components/holdings/SaleCard'
import { SaleHeader } from '@/components/holdings/SaleHeader'
import AppBackBtn from '@/components/app-back-button'
import { useRouter } from 'expo-router'

const Holdings = () => {
  const router = useRouter();

  const assetForSaleList: AssetForSale[] = [
    {
      id: '1',
      name: 'Solana',
      symbol: 'SOL',
      logo: 'solana',
      maturityDate: '10 December 2025',
      currentAPY: 11.30,
      timeLeft: 71,
      totalDuration: 90,
      progress: 0.21,// 19 days out of 90
      color: '#50C4AC',
      imageLink: 'https://res.cloudinary.com/dpk1nbczk/image/upload/v1759233401/solana-logo_s566xz.png',
      sellAmount: 2000
    },
    {
      id: '2',
      name: 'Solana',
      symbol: 'SOL',
      logo: 'solana',
      maturityDate: '10 December 2025',
      currentAPY: 11.30,
      timeLeft: 71,
      totalDuration: 90,
      progress: 0.21,// 19 days out of 90
      color: '#50C4AC',
      imageLink: 'https://res.cloudinary.com/dpk1nbczk/image/upload/v1759233401/solana-logo_s566xz.png',
      sellAmount: 2000
    },
    {
      id: '3',
      name: 'Solana',
      symbol: 'SOL',
      logo: 'solana',
      maturityDate: '10 December 2025',
      currentAPY: 11.30,
      timeLeft: 71,
      totalDuration: 90,
      progress: 0.21,// 19 days out of 90
      color: '#50C4AC',
      imageLink: 'https://res.cloudinary.com/dpk1nbczk/image/upload/v1759233401/solana-logo_s566xz.png',
      sellAmount: 2000
    },
  ]

  const handleSaleCardOnPress = () => {
    router.push(`/(tabs)/sell/holding/1`)
  }

  return (
    <AppPage>
      <AppBackBtn onPress={() => router.back()} title='Marketplace' />
      <SaleHeader totalListings={24} />
      <FlatList<AssetForSale>
        data={assetForSaleList}
        renderItem={({ item }) => <SaleCard holding={item} onPress={handleSaleCardOnPress}/>}
        keyExtractor={item => item.id}
      />
    </AppPage>
  )
}

export default Holdings
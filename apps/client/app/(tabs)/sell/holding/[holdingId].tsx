import React from 'react'
import { AppPage } from '@/components/app-page'
import AppBackBtn from '@/components/app-back-button'
import { useRouter } from 'expo-router'

const HoldingId = () => {
  const router = useRouter();

  return (
    <AppPage>
      <AppBackBtn onPress={() => router.back()} />
    </AppPage>
  )
}

export default HoldingId
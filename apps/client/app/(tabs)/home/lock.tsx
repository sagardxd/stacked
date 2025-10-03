import React from 'react'
import { useRouter } from 'expo-router';
import { AppPage } from '@/components/app-page';
import AppBackBtn from '@/components/app-back-button';

const Lock = () => {
    const router = useRouter();

    return (
        <AppPage>
            <AppBackBtn onPress={() => router.back()} />
        </AppPage>
  )
}

export default Lock
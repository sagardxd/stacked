import React from 'react'
import AppBackBtn from '@/components/app-back-button'
import { AppPage } from '@/components/app-page'
import { useRouter } from 'expo-router'

const Sip = () => {
    const router = useRouter();

    return (
        <AppPage>
            <AppBackBtn onPress={() => router.back()} />
        </AppPage>      
    )
}

export default Sip
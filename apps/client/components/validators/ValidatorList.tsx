import React from 'react'
import { AppView } from '../app-view'
import { Validator } from '@/types/validator.types'
import ValidatorCard from './ValidatorCard'
import { useRouter } from 'expo-router'

const Validators: Validator[] = [
    {
        id: "xLabscif2DLnYg39rQThqi7A9E45L9qiysRZhmZ1ARE",
        name: "xLabs",
        avatar_url: "https://xlabs.xyz/xlabs-icon.png",
        active_stake: 54182569855224,
        website: "https://xlabs.xyz",
        vote_account: "xLabsqDpN9WHXEXSJXk1yhqh5H8BgcqiBP1CR6Mkjcb",
        commission: 5,
        jito_enabled: true,
        jito_commission: 1000 / 100, // 1000 bps → 10%
        apr: 6.2, // placeholder, must be calculated
    },
    {
        id: "8yjHdsCgx3bp2zEwGiWSMgwpFaCSzfYAHT1vk7KJBqhN",
        name: "JStaking",
        avatar_url:
            "https://s3.amazonaws.com/keybase_processed_uploads/f8896fc57ff33aabf53f88b608de3c05_360_360.jpg",
        active_stake: 217017043248616,
        website: "https://jstaking.io",
        vote_account: "DPmsofVJ1UMRZADgwYAHotJnazMwohHzRHSoomL6Qcao",
        commission: 0,
        jito_enabled: true,
        jito_commission: 800 / 100,
        apr: 6.5,
    },
]


const ValidatorList = () => {
    const router = useRouter();

    const handleOnPress = (id: string) => {
        router.push(`/(tabs)/home/validator/${id}`)
    }

    return (
        <AppView>
            {Validators.map((validator) => (
                <ValidatorCard key={validator.id} validator={validator} onPress={handleOnPress} />
            ))}
        </AppView>
    )
}

export default ValidatorList
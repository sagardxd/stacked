import React from 'react'
import { StyleSheet } from 'react-native'
import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { useThemeColor } from '@/hooks/use-theme-color'

type ValidatorStatsProps = {
    apr: number
    commission: number
    jitoEnabled: boolean
    jitoCommission: number
    activeStake: string
}

const ValidatorStats: React.FC<ValidatorStatsProps> = ({ apr, commission, jitoEnabled, jitoCommission, activeStake }) => {
    const text = useThemeColor({}, 'text')
    return (
        <AppView style={styles.container}>
            <AppText type="caption" style={{ color: text }}>Estimated APR</AppText>
            <AppText type="label">{apr.toFixed(2)}%</AppText>

            <AppText type="caption" style={{ color: text }}>Commission</AppText>
            <AppText type="label">{commission}%</AppText>

            <AppText type="caption" style={{ color: text }}>Jito MEV</AppText>
            <AppText type="label">{jitoEnabled ? `${jitoCommission}%` : 'Disabled'}</AppText>

            <AppText type="caption" style={{ color: text }}>Active Stake</AppText>
            <AppText type="label">{activeStake}</AppText>
        </AppView>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginTop: 12,
    },
})

export default ValidatorStats



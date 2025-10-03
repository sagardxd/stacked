import React from 'react'
import { StyleSheet } from 'react-native'
import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { useThemeColor } from '@/hooks/use-theme-color'

type DetailsProps = {
    about?: string
    stakePools?: string[]
    softwareClient: string
}

const ValidatorDetails: React.FC<DetailsProps> = ({ about, stakePools, softwareClient }) => {
    const text = useThemeColor({}, 'text')
    return (
        <AppView style={styles.container}>
            <AppText type="caption" style={{ color: text }}>Details</AppText>
            <AppText>{about || '—'}</AppText>

            <AppText type="caption" style={{ color: text }}>Stake Pools</AppText>
            <AppText>{stakePools?.join(', ') || '—'}</AppText>

            <AppText type="caption" style={{ color: text }}>Software Client</AppText>
            <AppText>{softwareClient}</AppText>
        </AppView>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginTop: 12,
    },
})

export default ValidatorDetails



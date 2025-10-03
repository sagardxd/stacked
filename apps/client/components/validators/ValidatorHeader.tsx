import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { Image } from 'expo-image'
import { useThemeColor } from '@/hooks/use-theme-color'

type ValidatorHeaderProps = {
    name: string
    website: string
    avatarUrl: string
    onPressWebsite?: () => void
}

const ValidatorHeader: React.FC<ValidatorHeaderProps> = ({ name, website, avatarUrl, onPressWebsite }) => {
    const linkColor = '#00BFFF'
    return (
        <AppView style={styles.headerRow}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <AppView style={styles.headerInfo}>
                <AppText type="medium" style={styles.name}>{name}</AppText>
                <TouchableOpacity onPress={onPressWebsite}>
                    <AppText type="small" style={[styles.link, { color: linkColor }]} >
                        {website}
                    </AppText>
                </TouchableOpacity>
            </AppView>
        </AppView>
    )
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    headerInfo: {
        flex: 1,
        gap: 6,
    },
    name: {
        marginBottom: 2,
    },
    link: {
        opacity: 0.9,
    },
})

export default ValidatorHeader



import React from 'react'
import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'
import { AppCardView } from '../app-card-view'

export type ValidatorHeaderProps = {
    name: string;
    website: string;
    avatarUrl: string;
    onOpenLink: (url: string) => void;
}

const ValidatorHeader: React.FC<ValidatorHeaderProps> = ({ name, website, avatarUrl, onOpenLink }) => {
    const linkColor = useThemeColor({}, 'text');
    return (
        <AppCardView style={styles.headerRow}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <AppCardView style={styles.headerInfo}>
                <AppText type="medium" style={styles.name}>{name}</AppText>
                <AppText type="small" style={[styles.link, { color: linkColor }]} onPress={() => onOpenLink(website)}>
                    {website}
                </AppText>
            </AppCardView>
        </AppCardView>
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


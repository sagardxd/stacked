import { View, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Validator } from '@/types/validator.types'
import { AppView } from '../app-view'
import { useThemeColor } from '@/hooks/use-theme-color'
import { AppText } from '@/components/app-text'
import { Image } from 'expo-image'
import { lamportsToSol } from '@/utils/lamports-to-sol'
import { getColors } from '@/utils/get-image-dominant-color'

interface ValidatorCardProps {
    validator: Validator
    onPress: (id: string) => void
}

const ValidatorCard: React.FC<ValidatorCardProps> = ({ validator, onPress }) => {
    const cardBg = useThemeColor({}, 'cardBg');
    const border = useThemeColor({}, 'border');
    const [aprTextColor, setAprTextColor] = useState(useThemeColor({}, "text"))

    useEffect(() => {
        (async () => {
            const color = await getColors(validator.logoUrl)
            setAprTextColor(color);
        })()
    }, []);

    return (
        <AppView style={styles.cardcontainer}>
            <Pressable
                style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}
                onPress={() => onPress(validator.id)}
                android_ripple={{ color: border }}>
                {/* Top Section */}
                <View style={styles.topSection}>
                    <View style={styles.leftSection}>
                        <Image source={{ uri: validator.logoUrl || '' }} style={styles.logo} />
                        <View style={styles.info}>
                            <AppText type="medium" style={styles.name}>{validator.name || 'Unknown Validator'}</AppText>
                            <AppText type="caption" style={styles.website}>{validator.website || ''}</AppText>
                        </View>
                    </View>

                    <View style={styles.rightSection}>
                        <AppText type="caption" style={styles.apyLabel}>Estimated APR</AppText>
                        <AppText type="medium" style={{ color: aprTextColor }}>{validator.apr?.toFixed(2) || '0.00'}%</AppText>
                    </View>
                </View>

                {/* Bottom Section */}
                <View style={[styles.bottomSection, { borderTopColor: border }]}>
                    <View style={styles.row}>
                        <AppText type="caption">Commission</AppText>
                        <AppText type="label">{validator.commission || 0}%</AppText>
                    </View>
                    <View style={styles.row}>
                        <AppText type="caption">Network</AppText>
                        <AppText type="label">{validator.network || 'Unknown'}</AppText>
                    </View>
                    <View style={styles.row}>
                        <AppText type="caption">Active stake</AppText>
                        <AppText type="label">{lamportsToSol(parseInt(validator.activeStakeLamports || '0')).toLocaleString()} SOL</AppText>
                    </View>
                </View>
            </Pressable>
        </AppView>
    )
}

const styles = StyleSheet.create({
    cardcontainer: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    card: {
        borderRadius: 16,
        padding: 20,
        marginVertical: 4,
        borderWidth: 1,
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        marginBottom: 4,
    },
    website: {},
    rightSection: {
        alignItems: 'flex-end',
    },
    apyLabel: {
        marginBottom: 4,
    },
    bottomSection: {
        borderTopWidth: 1,
        paddingTop: 16,
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})

export default ValidatorCard
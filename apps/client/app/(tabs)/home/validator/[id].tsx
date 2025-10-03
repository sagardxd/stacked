import React, { useMemo } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppPage } from '@/components/app-page';
import { AppText } from '@/components/app-text';
import { ValidatorDetails as ValidatorDetailsType } from '@/types/validator.types';
import { AppView } from '@/components/app-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Image } from 'expo-image';
import { lamportsToSol } from '@/utils/lamports-to-sol';
import { Linking, StyleSheet, View } from 'react-native';
import AppBackBtn from '@/components/app-back-button';

const ValidatorDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const validator = useMemo<ValidatorDetailsType>(() => ({
        id: 'xLabscif2DLnYg39rQThqi7A9E45L9qiysRZhmZ1ARE',
        name: 'xLabys',
        avatar_url: 'https://xlabs.xyz/xlabs-icon.png',
        active_stake: 54182569855224,
        website: 'https://xlabs.xyz',
        vote_account: 'xLabsqDpN9WHXEXSJXk1yhqh5H8BgcqiBP1CR6Mkjcb',
        commission: 5,
        jito_enabled: true,
        jito_commission: 1000 / 100,
        apr: 6.2,
        details: 'High-performance validator with strong uptime and community presence.',
        stake_pools_list: ['Jito', 'Marinade', 'JPool'],
        software_client: 'Agave',
        software_version: '2.1.4',
    }), []);

    const openLink = (url: string) => {
        Linking.openURL(url).catch((err: any) => console.log("Couldn't load page", err));
    };
    return (
        <AppPage>
            <AppBackBtn onPress={() => router.back()} />
            <AppView style={styles.headerContainer}>
                <AppView style={styles.headerRow}>
                    <Image source={{ uri: validator.avatar_url }} style={styles.avatar} />
                    <AppView style={styles.headerInfo}>
                        <AppText type="medium" style={styles.name}>{validator.name}</AppText>
                        <AppText type="caption" style={[styles.link]} onPress={() => openLink(validator.website)}>{validator.website}</AppText>
                    </AppView>
                </AppView>
            </AppView>

            {/* Stats - simple stacked */}
            <AppView style={styles.section}>
                <Field label="Estimated APR" value={`${validator.apr.toFixed(2)}%`} />
                <Field label="Commission" value={`${validator.commission}%`} />
                <Field label="Jito MEV" value={validator.jito_enabled ? `${validator.jito_commission}%` : 'Disabled'} />
                <Field label="Active stake" value={`${lamportsToSol(validator.active_stake).toLocaleString()} SOL`} />
            </AppView>

            {/* Details Section */}
            <AppView style={styles.section}>
                <Field label="Details" value={validator.details || '—'} />
                <Field label="Stake pools" value={validator.stake_pools_list?.join(', ') || '—'} />
                <Field label="Software client" value={validator.software_client} />
                <Field label="Software version" value={validator.software_version} />
            </AppView>
        </AppPage>
    )
}

const Field = ({ label, value }: { label: string; value: string }) => {
    const text = useThemeColor({}, 'text');
    return (
        <AppView style={styles.field}>
            <AppText type="caption" style={[{ color: text }]}>{label}</AppText>
            <AppText type="label">{value}</AppText>
        </AppView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        gap: 16,
        marginBottom: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    headerInfo: {
        flex: 1,
    },
    name: {
    },
    link: {
        color: '#00BFFF'
    },
    section: {
        gap: 10,
        marginTop: 12,
    },
    field: {
        gap: 4,
    },
});


export default ValidatorDetails
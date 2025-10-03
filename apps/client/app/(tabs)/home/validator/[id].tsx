import React, { useMemo } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppPage } from '@/components/app-page';
import { AppText } from '@/components/app-text';
import { ValidatorDetails as ValidatorDetailsType } from '@/types/validator.types';
import { AppView } from '@/components/app-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Image } from 'expo-image';
import { lamportsToSol } from '@/utils/lamports-to-sol';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import AppBackBtn from '@/components/app-back-button';
import { AppCardView } from '@/components/app-card-view';
import DetailField from '@/components/common/DetailField';
import StatCard from '@/components/common/StatCard';

const ValidatorDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const cardBg = useThemeColor({}, 'cardBg');
    const border = useThemeColor({}, 'border');

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

            <ScrollView>
                {/* Header Card */}
                <AppView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
                    <AppView style={[styles.headerRow, { backgroundColor: cardBg }]}>
                        <Image source={{ uri: validator.avatar_url }} style={styles.avatar} />
                        <AppCardView style={styles.headerInfo}>
                            <AppText type="medium" style={styles.name}>{validator.name}</AppText>
                            <AppText
                                type="small"
                                style={styles.link}
                                onPress={() => openLink(validator.website)}
                            >
                                {validator.website}
                            </AppText>
                        </AppCardView>
                    </AppView>
                </AppView>

                {/* Performance Stats Card */}
                <AppView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
                    <AppText type="body" style={styles.sectionTitle}>Performance</AppText>
                    <AppCardView style={styles.statsGrid}>
                        <StatCard
                            label="Estimated APR"
                            value={`${validator.apr.toFixed(2)}%`}
                            highlight
                        />
                        <StatCard
                            label="Commission"
                            value={`${validator.commission}%`}
                        />
                        <StatCard
                            label="Jito MEV"
                            value={validator.jito_enabled ? `${validator.jito_commission}%` : 'Disabled'}
                        />
                        <StatCard
                            label="Active Stake"
                            value={`${lamportsToSol(validator.active_stake).toLocaleString()} SOL`}
                        />
                    </AppCardView>
                </AppView>

                {/* Details Card */}
                <AppView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
                    <AppText type="body" style={styles.sectionTitle}>Details</AppText>
                    <AppCardView style={styles.detailsContainer}>
                        <DetailField label="About" value={validator.details || '—'} />
                        <DetailField label="Stake Pools" value={validator.stake_pools_list?.join(', ') || '—'} />
                        <DetailField label="Software Client" value={validator.software_client} />
                        <DetailField label="Software Version" value={validator.software_version} />
                    </AppCardView>
                </AppView>
            </ScrollView>
        </AppPage>
    )
}




const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
    },
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
        color: '#00BFFF',
        opacity: 0.9,
    },
    sectionTitle: {
        marginBottom: 16,
        opacity: 0.6,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    detailsContainer: {
        gap: 20,
    },

});

export default ValidatorDetails
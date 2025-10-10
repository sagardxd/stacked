import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppPage } from '@/components/app-page';
import { AppText } from '@/components/app-text';
import { ValidatorDetails as ValidatorDetailsType } from '@/types/validator.types';
import { AppView } from '@/components/app-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { lamportsToSol } from '@/utils/lamports-to-sol';
import { Linking, ScrollView, StyleSheet } from 'react-native';
import AppBackBtn from '@/components/app-back-button';
import ValidatorHeader from '@/components/validators/ValidatorHeader';
import ValidatorStats from '@/components/validators/ValidatorStats';
import ValidatorDetailsSection from '@/components/validators/ValidatorDetailsSection';
import { AppButton } from '@/components/onboarding';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const ValidatorDetails = () => {
    const { validatorId } = useLocalSearchParams<{ validatorId: string }>();
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
    }), []);

    const openLink = (url: string) => {
        Linking.openURL(url).catch((err: any) => console.log("Couldn't load page", err));
    };
    return (
        <BottomSheetModalProvider>
            <AppView style={{ flex: 1 }}>
                <AppPage>
                    <AppBackBtn onPress={() => router.back()} />

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header Card */}
                        <AppView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
                            <ValidatorHeader
                                name={validator.name}
                                website={validator.website}
                                avatarUrl={validator.avatar_url}
                                onOpenLink={openLink}
                            />
                        </AppView>

                        {/* Statistics Card */}
                        <AppView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
                            <AppText type="small" style={styles.sectionTitle}>Statistics</AppText>
                            <ValidatorStats
                                aprPercent={`${validator.apr.toFixed(2)}%`}
                                commissionPercent={`${validator.commission}%`}
                                jitoText={validator.jito_enabled ? `${validator.jito_commission}%` : 'Disabled'}
                                activeStakeText={`${lamportsToSol(validator.active_stake).toLocaleString()} SOL`}
                            />
                        </AppView>

                        {/* Details Card */}
                        <AppView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
                            <AppText type="small" style={styles.sectionTitle}>Details</AppText>
                            <ValidatorDetailsSection
                                about={validator.details || '—'}
                                stakePools={validator.stake_pools_list?.join(', ') || '—'}
                                softwareClient={validator.software_client}
                            />
                        </AppView>


                    </ScrollView>
                </AppPage>
                {/* Actions */}
                <AppView style={styles.buttonContainer}>
                    <AppButton title='Lock Assets' onPress={() => router.push('/(tabs)/home/lock')} type='secondary' buttonStyle={{ flex: 1 }} />
                </AppView>
            </AppView>
        </BottomSheetModalProvider>
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
    buttonContainer: {
        flexDirection: 'row',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 12,
        bottom: 0,
        paddingBottom: 30,
        paddingHorizontal: 16
    }

});

export default ValidatorDetails
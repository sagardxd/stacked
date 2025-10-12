import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppPage } from '@/components/app-page';
import { AppText } from '@/components/app-text';
import { Validator } from '@/types/validator.types';
import { AppView } from '@/components/app-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { lamportsToSol } from '@/utils/lamports-to-sol';
import { Linking, ScrollView, StyleSheet } from 'react-native';
import AppBackBtn from '@/components/app-back-button';
import ValidatorHeader from '@/components/validators/ValidatorHeader';
import ValidatorStats from '@/components/validators/ValidatorStats';
import ValidatorDetailsSection from '@/components/validators/ValidatorDetailsSection';
import { AppButton } from '@/components/onboarding';
import { getValidatorById } from '@/services/validator.services';

const ValidatorDetails = () => {
    const { validatorId } = useLocalSearchParams<{ validatorId: string }>();
    const router = useRouter();
    const cardBg = useThemeColor({}, 'cardBg');
    const border = useThemeColor({}, 'border');
    const [validator, setValidator] = useState<Validator | null>(null);

    // Fetch validator data
    useEffect(() => {
        const fetchValidator = async () => {
            if (validatorId) {
                const validatorData = await getValidatorById(validatorId);
                setValidator(validatorData || null);
            }
        };
        fetchValidator();
    }, [validatorId]);

    if (!validator) {
        return (
            <AppView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <AppText>Loading...</AppText>
            </AppView>
        );
    }

    const openLink = (url: string) => {
        Linking.openURL(url).catch((err: any) => console.log("Couldn't load page", err));
    };

    return (
        <AppView style={{ flex: 1 }}>
            <AppPage>
                <AppBackBtn onPress={() => router.back()} />

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header Card */}
                    <AppView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
                        <ValidatorHeader
                            name={validator.name || 'Unknown Validator'}
                            website={validator.website || ''}
                            avatarUrl={validator.logoUrl || ''}
                            onOpenLink={openLink}
                        />
                    </AppView>

                    {/* Statistics Card */}
                    <AppView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
                        <AppText type="small" style={styles.sectionTitle}>Statistics</AppText>
                        <ValidatorStats
                            aprPercent={`${validator.apr?.toFixed(2) || '0.00'}%`}
                            commissionPercent={`${validator.commission || 0}%`}
                            network={validator.network || 'Unknown'}
                            activeStakeText={`${lamportsToSol(parseInt(validator.activeStakeLamports || '0')).toLocaleString()} SOL`}
                        />
                    </AppView>

                    {/* Details Card */}
                    <AppView style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
                        <AppText type="small" style={styles.sectionTitle}>Details</AppText>
                        <ValidatorDetailsSection
                            about={validator.details || '—'}
                            voteAccount={validator.voteAccountPubkey || '—'}
                            network={validator.network || 'Unknown'}
                            createdAt={validator.createdAt || '—'}
                            updatedAt={validator.updatedAt || '—'}
                        />
                    </AppView>


                </ScrollView>
            </AppPage>
            {/* Actions */}
            <AppView style={styles.buttonContainer}>
                <AppButton title='Lock Assets' onPress={() => router.push({pathname: '/(tabs)/home/lock', params: {apr: validator.apr}} )} type='secondary' buttonStyle={{ flex: 1 }} />
            </AppView>
        </AppView>
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
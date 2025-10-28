import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { AppPage } from '@/components/app-page';
import AppBackBtn from '@/components/app-back-button';
import SlideButton from '@/components/ui/shrimmer-btn/ShrimmerBtn';
import { Ionicons } from '@expo/vector-icons'
import { useSharedValue } from 'react-native-reanimated';
import { useThemeColor } from '@/hooks/use-theme-color';
import { AppText } from '@/components/app-text';
import { AppView } from '@/components/app-view';
import { StyleSheet } from 'react-native';
import DurationSelector from '@/components/ui/DurationSelector';
import AmountInput from '@/components/ui/AmountInput';
import AssetBadge from '@/components/asset/AssetBadge';
import SummarySection from '@/components/ui/SummarySection';
import { useWalletUi } from '@/components/solana/use-wallet-ui';
import { useGetBalance } from '@/components/account/use-get-balance';
import { lamportsToSol } from '@/utils/lamports-to-sol';

const Lock = () => {
    const router = useRouter();
    const { signMessage, account } = useWalletUi()
    const userBalance = useGetBalance({ address: account!.publicKey })
    const finalUserBalance = userBalance.data ? lamportsToSol(userBalance.data) : 0
    const completed = useSharedValue(false);
    const text = useThemeColor({}, "text");
    const accent = useThemeColor({}, "accent");

    const [quantity, setQuantity] = useState('');
    const [transactionCompleted, setTransactionCompleted] = useState(false)
    const [durationUnit, setDurationUnit] = useState<'Months' | 'Years'>('Years');
    const [duration, setDuration] = useState<number>(1);

    const handleDurationChange = (newDuration: number) => {
        setDuration(newDuration);
    }

    const handleUnitChange = (newUnit: 'Months' | 'Years') => {
        setDurationUnit(newUnit);
        // Reset to first preset when changing unit
        const presets = newUnit === 'Months' ? [1, 2, 5, 8, 10, 12] : [1, 2, 3, 5, 10];
        setDuration(presets[0]);
    }

    const handleQuantityChange = (text: string) => {
        const regex = /^\d*\.?\d*$/
        if (regex.test(text)) {
            setQuantity(text)
        }
    }

    const handleHalfPress = () => {
        let quantity = (finalUserBalance / 2).toString();
        setQuantity(quantity);
    }

    const handleMaxPress = () => {
        setQuantity((finalUserBalance).toString());
    }

    const hanndleComplete = async () => {
        try {
            const encoded = new TextEncoder().encode(JSON.stringify({ message: "locking asset" }));
            await signMessage(encoded)
        } catch {

        }
    }

    return (
        <AppPage>
            <AppBackBtn onPress={() => router.back()} />

            <AppView style={styles.container}>
                {/* Header */}
                <AppView style={styles.header}>
                    <AppText type='medium' style={[styles.headerTitle, { color: text }]}>Lock Assets</AppText>
                    <AssetBadge />
                </AppView>

                <AppView style={styles.inputContainer}>
                    {/* Amount Input Section */}
                    <AmountInput
                        value={quantity}
                        onChangeText={handleQuantityChange}
                        placeholder='0.00'
                        currency='SOL'
                        balance={finalUserBalance}
                        onHalfPress={handleHalfPress}
                        onMaxPress={handleMaxPress}
                    />

                    {/* Duration Section */}
                    <DurationSelector
                        selectedDuration={duration}
                        selectedUnit={durationUnit}
                        onDurationChange={handleDurationChange}
                        onUnitChange={handleUnitChange}
                    />
                </AppView>

                {/* Summary Section */}
                <SummarySection
                    quantity={quantity}
                    duration={duration}
                    durationUnit={durationUnit}
                />

                <AppView style={styles.sliderBtnContainer}>
                    <SlideButton
                        startIcon={<Ionicons name='chevron-forward-sharp' color={'white'} />}
                        endIcon={<Ionicons size={18} name={transactionCompleted ? "checkmark" : "finger-print-outline"} color={'white'} />}
                        fillColor={accent as any}
                        handleColor={'#000000'}
                        baseColor={text + '10'}
                        aboveText="locking assets..."
                        finalText={transactionCompleted ? "Success!" : "Intialized..."}
                        shimmerTextProps={{
                            text: 'Slide to lock',
                            speed: 4000,
                            color: text + '80'
                        }}
                        style={styles.ctaSlideButton}
                        completed={completed}
                        onComplete={hanndleComplete}
                    />
                </AppView>
            </AppView>
        </AppPage>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 14
    },
    headerTitle: {
        fontSize: 24
    },
    inputContainer: {
        gap: 24,
        flex: 1
    },
    ctaSlideButton: {
        height: 64,
        borderRadius: 32
    },
    sliderBtnContainer: {
        paddingBottom: 30
    }
})

export default Lock
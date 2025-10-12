import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppPage } from '@/components/app-page';
import AppBackBtn from '@/components/app-back-button';
import SlideButton from '@/components/ui/shrimmer-btn/ShrimmerBtn';
import { Ionicons } from '@expo/vector-icons'
import { useSharedValue } from 'react-native-reanimated';
import { useThemeColor } from '@/hooks/use-theme-color';
import AppTextInput from '@/components/app-textInput';
import { AppText } from '@/components/app-text';
import { useAssetStore } from '@/store/asset.store';
import { Asset } from '@/types/asset.types';
import { AppView } from '@/components/app-view';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { AppDropdown } from '@/components/app-dropdown';
import { AppCardView } from '@/components/app-card-view';
import DurationSelector from '@/components/ui/DurationSelector';
import AmountInput from '@/components/ui/AmountInput';
import AssetBadge from '@/components/asset/AssetBadge';
import SummarySection from '@/components/ui/SummarySection';

const Lock = () => {
    const router = useRouter();
    const {apr} = useLocalSearchParams<{ apr: string }>();
    const completed = useSharedValue(false);
    const text = useThemeColor({}, "text");
    const accent = useThemeColor({}, "accent");


    const [quantity, setQuantity] = useState('');
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
        // Set to half of balance (you can implement actual balance logic)
        setQuantity('5.0');
    }

    const handleMaxPress = () => {
        // Set to max balance (you can implement actual balance logic)
        setQuantity('10.0');
    }

    const handleCurrencyPress = () => {
        // Handle currency selection (you can implement currency picker)
        console.log('Currency selector pressed');
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
                        balance='10.0 SOL'
                        onHalfPress={handleHalfPress}
                        onMaxPress={handleMaxPress}
                        onCurrencyPress={handleCurrencyPress}
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
                    apr={apr}
                />

                <AppView style={styles.sliderBtnContainer}>
                    <SlideButton
                        startIcon={<Ionicons name='chevron-forward-sharp' color={'white'} />}
                        endIcon={<Ionicons name='checkmark' color={'white'} />}
                        fillColor={accent as any}
                        handleColor={'#000000'}
                        baseColor={text + '10'}
                        aboveText="locking assets..."
                        finalText="Success!"
                        shimmerTextProps={{
                            text: 'Slide to lock',
                            speed: 4000,
                            color: text + '80'
                        }}
                        style={styles.ctaSlideButton}
                        completed={completed}
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
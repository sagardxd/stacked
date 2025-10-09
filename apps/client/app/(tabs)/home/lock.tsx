import React, { useState } from 'react'
import { useRouter } from 'expo-router';
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
import Slider from '@react-native-community/slider';
import { AppDropdown } from '@/components/app-dropdown';

const Lock = () => {
    const router = useRouter();
    const completed = useSharedValue(false);
    const text = useThemeColor({}, "text");
    const accent = useThemeColor({}, "accent");
    const border = useThemeColor({}, 'border');
    const background = useThemeColor({}, 'background');

    const [quantity, setQuantity] = useState('');
    const [durationUnit, setDurationUnit] = useState<'Months' | 'Years'>('Months');
    const [duration, setDuration] = useState<number>(3);
    const [isTransferable, setIsTransferable] = useState<boolean>(false);

    const assetPrice = useAssetStore((state) => state.getAsset(Asset.SOL));

    if (!assetPrice) return <AppText>Asset not found </AppText>

    const unitMax = durationUnit === 'Months' ? 60 : 10;
    const unitStep = 1;

    const adjustDuration = (delta: number) => {
        setDuration((prev) => {
            const next = Math.min(Math.max(prev + delta, 1), unitMax)
            return next
        })
    }

    const handleQuantityChange = (text: string) => {
        const regex = /^\d*\.?\d*$/
        if (regex.test(text)) { 
            setQuantity(text)
        }
    }

    const lockedValue = ((assetPrice.currPrice / Math.pow(10, assetPrice.decimal)) * Number(quantity || '0')).toFixed(2);

    return (
        <AppPage>
            <AppBackBtn onPress={() => router.back()} />

            <AppView style={styles.container}>
                <AppView >
                    <AppText type='medium'>Lock Assets</AppText>
                    <AppText type='body' style={styles.subtitle}>
                        Invest your SOL securly
                    </AppText>
                </AppView>

                <AppView style={styles.inputContainer}>
                    {/* Amount Section */}
                    <AppView style={[styles.card, { borderColor: border, backgroundColor: background }]}>
                        <AppText type='label' style={styles.sectionLabel}>AMOUNT</AppText>
                        <AppTextInput
                            value={quantity}
                            onChangeText={handleQuantityChange}
                            keyboardType='decimal-pad'
                            placeholder='0.00'
                        />
                        <AppView style={styles.valueDisplay}>
                            <AppText type='caption' style={{ color: text + '90' }}>
                                Locked Value
                            </AppText>
                            <AppText type='medium' style={{ color: accent }}>
                                ${lockedValue}
                            </AppText>
                        </AppView>
                    </AppView>

                    {/* Duration Section */}
                    <AppView style={[styles.card, { borderColor: border, backgroundColor: background }]}>
                        <AppView style={styles.durationHeader}>
                            <AppText type='label' style={styles.sectionLabel}>DURATION</AppText>
                            <AppView style={styles.durationBadge}>
                                <AppText type='button' style={{ color: accent }}>
                                    {duration}
                                </AppText>
                                <AppDropdown
                                    minwidth={100}
                                    items={['Months', 'Years']}
                                    selectedItem={durationUnit}
                                    selectItem={(item) => setDurationUnit(item as 'Months' | 'Years')}
                                />
                            </AppView>
                        </AppView>

                        <AppView style={styles.sliderSection}>
                            <TouchableOpacity
                                onPress={() => adjustDuration(-1)}
                                disabled={duration <= 1}
                                style={[
                                    styles.sliderBtn,
                                    { 
                                        borderColor: border,
                                        backgroundColor: duration <= 1 ? background : accent + '15',
                                        opacity: duration <= 1 ? 0.3 : 1 
                                    }
                                ]}
                            >
                                <Ionicons 
                                    name='remove' 
                                    size={20} 
                                    color={duration <= 1 ? text + '40' : accent} 
                                />
                            </TouchableOpacity>

                            <AppView style={styles.sliderWrapper}>
                                <Slider
                                    minimumValue={1}
                                    maximumValue={unitMax}
                                    step={unitStep}
                                    value={duration}
                                    onValueChange={(v) => setDuration(Math.round(v))}
                                    minimumTrackTintColor={accent as any}
                                    maximumTrackTintColor={text + '20'}
                                    thumbTintColor={accent as any}
                                    style={styles.slider}
                                />
                                <AppView style={styles.sliderLabels}>
                                    <AppText type='caption' style={{ color: text + '50' }}>
                                        1
                                    </AppText>
                                    <AppText type='caption' style={{ color: text + '50' }}>
                                        {unitMax}
                                    </AppText>
                                </AppView>
                            </AppView>

                            <TouchableOpacity
                                onPress={() => adjustDuration(+1)}
                                disabled={duration >= unitMax}
                                style={[
                                    styles.sliderBtn,
                                    { 
                                        borderColor: border,
                                        backgroundColor: duration >= unitMax ? background : accent + '15',
                                        opacity: duration >= unitMax ? 0.3 : 1 
                                    }
                                ]}
                            >
                                <Ionicons 
                                    name='add' 
                                    size={20} 
                                    color={duration >= unitMax ? text + '40' : accent} 
                                />
                            </TouchableOpacity>
                        </AppView>
                    </AppView>

                    {/* Transferable Toggle */}
                    <AppView style={[styles.card, styles.transferCard, { borderColor: border, backgroundColor: background }]}>
                        <AppView style={styles.transferContent}>
                            <AppView>
                                <AppText type='label'>Transferable</AppText>
                                <AppText type='caption' style={{ color: text + '60', marginTop: 4 }}>
                                    Allow transfer to another wallet
                                </AppText>
                            </AppView>
                            <View style={[
                                styles.switchContainer,
                                { backgroundColor: isTransferable ? accent + '20' : text + '10' }
                            ]}>
                                <Switch 
                                    value={isTransferable} 
                                    onValueChange={setIsTransferable}
                                    trackColor={{ false: 'transparent', true: 'transparent' }}
                                    thumbColor={isTransferable ? accent : text + '40'}
                                    ios_backgroundColor="transparent"
                                />
                            </View>
                        </AppView>
                    </AppView>
                </AppView>

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
        gap: 24,
        justifyContent: "space-between",
    },
    subtitle: {
        opacity: 0.6
    },
    inputContainer: {
        gap: 20,
        flex: 1
    },
    card: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        gap: 16
    },
    sectionLabel: {
        opacity: 0.5,
        letterSpacing: 1.2
    },
    valueDisplay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
    },
    durationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    sliderSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: 8
    },
    sliderBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sliderWrapper: {
        flex: 1,
        gap: 8
    },
    slider: {
        width: '100%',
        height: 40
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4
    },
    transferCard: {
        marginTop: 'auto'
    },
    transferContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    switchContainer: {
        borderRadius: 20,
        overflow: 'hidden'
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
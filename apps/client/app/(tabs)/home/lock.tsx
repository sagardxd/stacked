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
import { StyleSheet, Switch, TouchableOpacity } from 'react-native';
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

    // const assetPrice = useAssetStore((state) => state.getAsset(Asset.SOL));

    // if (!assetPrice) return <AppText>Asset not found </AppText>

    const unitMax = durationUnit === 'Months' ? 60 : 10; // up to 5y months or 10y
    const unitStep = 1;

    const adjustDuration = (delta: number) => {
        setDuration((prev) => {
            const next = Math.min(Math.max(prev + delta, 1), unitMax)
            return next
        })
    }

    return (
        <AppPage>
            <AppBackBtn onPress={() => router.back()} />

            <AppView style={styles.container}>
                <AppView style={styles.inputContainer}>
                    <AppView>
                        <AppText type='label'>Amount</AppText>
                        <AppTextInput
                            value={quantity}
                            setValue={setQuantity}
                            keyboardType='number-pad'
                            placeholder='Enter the quantity'
                        />
                        {/* <AppText style={styles.lockingNote}>The sol your locking in $: {((assetPrice.currPrice / Math.pow(10, assetPrice.decimal)) * Number(quantity || '0')).toFixed(2)}</AppText> */}
                    </AppView>

                    <AppView style={styles.card}>
                        <AppView style={styles.durationHeader}>
                            <AppText type='label'>Duration</AppText>
                            <AppView style={styles.durationHeaderRight}>
                                <AppView style={styles.dropdownWrap}>
                                    <AppText>{duration} {durationUnit.toLowerCase()}</AppText>
                                    <AppDropdown
                                    minwidth={0}
                                        items={['Months', 'Years']}
                                        selectedItem={durationUnit}
                                        selectItem={(item) => setDurationUnit(item as 'Months' | 'Years')}
                                    />
                                </AppView>
                            </AppView>
                        </AppView>

                        <AppView style={styles.sliderRow}>
                            <TouchableOpacity
                                onPress={() => adjustDuration(-1)}
                                disabled={duration <= 1}
                                style={[styles.adjustBtn, { borderColor: border, backgroundColor: background, opacity: duration <= 1 ? 0.5 : 1 }]}
                            >
                                <AppText type='button'>-</AppText>
                            </TouchableOpacity>

                            <AppView style={styles.sliderContainer}>
                                <Slider
                                    minimumValue={1}
                                    maximumValue={unitMax}
                                    step={unitStep}
                                    value={duration}
                                    onValueChange={(v) => setDuration(Math.round(v))}
                                    minimumTrackTintColor={accent as any}
                                    maximumTrackTintColor={text + '30'}
                                    thumbTintColor={'#000'}
                                />
                            </AppView>

                            <TouchableOpacity
                                onPress={() => adjustDuration(+1)}
                                disabled={duration >= unitMax}
                                style={[styles.adjustBtn, { borderColor: border, backgroundColor: background, opacity: duration >= unitMax ? 0.5 : 1 }]}
                            >
                                <AppText type='button'>+</AppText>
                            </TouchableOpacity>
                        </AppView>
                    </AppView>

                    <AppView style={styles.transferRow}>
                        <AppText>Transferable</AppText>
                        <Switch value={isTransferable} onValueChange={setIsTransferable} thumbColor={'#000'} trackColor={{ false: text + '30', true: accent as any }} />
                    </AppView>
                </AppView>

                <AppView style={styles.silderBtn}>
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
        gap: 16,
        justifyContent: "space-between"
    },
    inputContainer: {
        gap: 20
    },
    card: {
        // padding: 16,
        // borderRadius: 12,
        // borderWidth: 1,
        // gap: 12
    },
    durationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    durationHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    dropdownWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 8
    },
    sliderContainer: {
        flex: 1
    },
    adjustBtn: {
        width: 44,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    transferRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    ctaSlideButton: {
        height: 56
    },
    silderBtn: {
        paddingBottom: 30
    }
})

export default Lock
import React from 'react'
import { useRouter } from 'expo-router';
import { AppPage } from '@/components/app-page';
import AppBackBtn from '@/components/app-back-button';
import SlideButton, { SPRING_CONFIG } from '@/components/ui/shrimmer-btn/ShrimmerBtn';
import { Ionicons } from '@expo/vector-icons'
import {  useSharedValue } from 'react-native-reanimated';
import { useThemeColor } from '@/hooks/use-theme-color';

const Lock = () => {
    const router = useRouter();
    const completed = useSharedValue(false);
    const text = useThemeColor({}, "text");
    const accent = useThemeColor({}, "accent");

    return (
        <AppPage>
            <AppBackBtn onPress={() => router.back()} />
            <SlideButton
                startIcon={<Ionicons name='chevron-forward-sharp' color={'white'} />}
                endIcon={<Ionicons name='checkmark' color={'white'} />}
                fillColor={accent as any}
                handleColor={"#000000"}
                baseColor={text + "10"}
                aboveText="locking assets..."
                finalText="Success!"
                shimmerTextProps={{
                    text: "Slide to lock",
                    speed: 4000,
                    color: text + "80"
                }}
                style={{
                    height: 56,
                }}
                completed={completed}
            />
        </AppPage>
    )
}

export default Lock
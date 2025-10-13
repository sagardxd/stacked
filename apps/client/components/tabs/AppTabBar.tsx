import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { AppView } from '../app-view'
import { UiIconSymbol, UiIconSymbolName } from '../ui/ui-icon-symbol'
import { useThemeColor } from '@/hooks/use-theme-color'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { usePathname } from 'expo-router'

const AppTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const accent = useThemeColor({}, "accent")
    const translateX = useSharedValue<number>(0);
    const pathname = usePathname()

    // Hide tab bar on any sub-routes
    const shouldHideTabs = pathname.split('/').length > 2


    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: withSpring(translateX.value * 2) }],
    }));


    const getTabIconName = (label: string): UiIconSymbolName => {

        let iconName = 'home'
        if (label == "home") iconName = 'home'
        else if (label == "portfolio") iconName = 'wallet'
        else if (label == "settings") iconName = 'settings'

        return iconName as UiIconSymbolName
    }

    if (shouldHideTabs) return null


    return (
        <AppView style={styles.wrapper}>
            <Animated.View style={[animatedStyles]} />
            <AppView style={styles.container}>
                {state.routes.map((route, index) => {

                    const label = (descriptors[route.key].options.tabBarLabel ??
                        descriptors[route.key].options.title ??
                        route.name).toString().toLocaleLowerCase()

                    const iconName = getTabIconName(label as string)

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={[styles.tab, isFocused && styles.activeTab, isFocused && { backgroundColor: '#181533' }]}
                        >
                            <UiIconSymbol size={24} name={iconName} color={isFocused ? accent : '#353535'} />
                        </TouchableOpacity>
                    );
                })
                }

            </AppView>
        </AppView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "transparent",
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    container: {
        flexDirection: 'row',
        backgroundColor: '#101010',
        justifyContent: 'space-around',
        paddingVertical: 10,
        marginBottom: 30,
        borderRadius: 200,
    },
    tab: {
        marginHorizontal: 10,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        borderRadius: 200
    },
});

export default AppTabBar
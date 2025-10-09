import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { AppView } from './app-view'
import { Image } from 'expo-image'
import { AppText } from './app-text'

interface AppBackBtnProps {
    onPress: () => void
    title?: string
}

const AppBackBtn: React.FC<AppBackBtnProps> = ({ onPress, title }) => {
    return (
        <AppView style={styles.container}>
            <TouchableOpacity onPress={onPress} style={styles.imageContainer}>
                <Image source={require('@/assets/images/icons/back.png')} style={styles.backImage} />
            </TouchableOpacity>
            {title && <AppText type='medium'>{title}</AppText>}
        </AppView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
        marginLeft: 7,
    },
    imageContainer: {
        width: 30,
        height: 30,
        justifyContent: 'center'
    },

    backImage: {
        width: 25,
        height: 25
    }
})

export default AppBackBtn
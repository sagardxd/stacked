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
            <TouchableOpacity onPress={onPress}>
                <Image source={require('@/assets/images/icons/back.png')} style={styles.backImage} />
            </TouchableOpacity>
            {title && <AppText type='label'>{title}</AppText>}
        </AppView>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 5,
        marginLeft: 5
    },
    backImage: {
        width: 18,
        height: 18
    }
})

export default AppBackBtn
import React, { forwardRef, ReactNode, useState } from 'react'
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native'
import { AppText } from './app-text'
import { useThemeColor } from '@/hooks/use-theme-color'

type AppTextInputProps = {
    value: string
    setValue: (text: string) => void
    variant?: 'primary' | 'secondary'
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    error?: string
} & TextInputProps

const AppTextInput = forwardRef<TextInput, AppTextInputProps>(({ value, setValue, variant= 'primary', leftIcon, rightIcon, error, style, ...rest }, ref) => {
    const accent = useThemeColor({}, "accent")
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, isFocused && { borderColor: accent}]}>
                {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
                <TextInput
                    ref={ref}
                    style={[styles.input, style, variant === 'primary' ? styles.primary : styles.secondary]}
                    value={value}
                    onChangeText={setValue}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholderTextColor={'grey'}
                    {...rest}
                />
                {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
            </View>
            {error && <AppText>{error}</AppText>}
        </View>
    )
}
)

const styles = StyleSheet.create({
    container: {
        gap: 10
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: "#A6A6A6",
        alignItems: 'center',
        borderRadius: 12,
        height: 50,
        paddingHorizontal: 10
    },
    icon: {
        paddingHorizontal: 12
    },
    input: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingHorizontal: 10,
        color: 'white'
    },
    primary: {
    },
    secondary: {
    }
})

export default AppTextInput
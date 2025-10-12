import ImageColors from 'react-native-image-colors'

export const getColors = async (url: string) => {
    const result = await ImageColors.getColors(url, {
        fallback: '#ffffff',
    })

    switch (result.platform) {
        case 'android':
            return result.dominant
        case 'ios':
            return result.background
        default:
            return "#ffffff"
    }
}
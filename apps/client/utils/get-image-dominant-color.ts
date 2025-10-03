import ImageColors from 'react-native-image-colors'

export const getColors = async (url: string) => {
    const result = await ImageColors.getColors(url, {
        fallback: '#000000',
    })

    console.log(result)

    switch (result.platform) {
        case 'android':
            return result.dominant
        case 'ios':
            return result.background
        default:
            return "#000"
    }
}
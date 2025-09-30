import { router } from 'expo-router'
import { useAuth } from '@/components/auth/auth-provider'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { OnboardingFlow } from '@/components/onboarding'
import { AppConfig } from '@/constants/app-config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, View, StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useAppTheme } from '@/components/app-theme'


export default function SignIn() {
  const { signIn, isLoading } = useAuth()
  const { isDark } = useAppTheme()

  const handleConnect = async () => {
    await signIn()
    router.replace('/')
  }

  return (
    <AppView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#fff' : '#0a7ea4'} />
          <AppText style={styles.loadingText}>Connecting...</AppText>
        </View>
      ) : (
        <OnboardingFlow />
      )}
    </AppView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  }
})

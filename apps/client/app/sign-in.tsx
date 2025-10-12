import { router } from 'expo-router'
import { useAuth } from '@/components/auth/auth-provider'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { OnboardingFlow } from '@/components/onboarding'
import { ActivityIndicator, View, StyleSheet, } from 'react-native'
import { useAppTheme } from '@/components/app-theme'


export default function SignIn() {
  const { signIn, isLoading } = useAuth()
  const { isDark } = useAppTheme()

  const handleConnect = async () => {
    await signIn()
    router.replace('/(tabs)/home')
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

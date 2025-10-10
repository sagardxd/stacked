import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { AppButton } from './app-button'
import { WelcomeContent } from './welcome-content'
import { StoryComponent } from './story-component'
import { useAuth } from '../auth/auth-provider'
import { router } from 'expo-router'

type OnboardingScreen = 'welcome' | 'stories'

export function OnboardingFlow() {
  const [currentScreen, setCurrentScreen] = useState<OnboardingScreen>('welcome')
  const { signIn, isLoading } = useAuth()

  const handleContinue = () => {
    setCurrentScreen('stories')
  }

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome')
  }

  const connectWallet = async() => {
      await signIn();
      router.replace('/(tabs)/home')
  }

  const renderContent = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeContent />
      case 'stories':
        return (
          <StoryComponent 
            onClose={handleBackToWelcome}
            onComplete={connectWallet}
          />
        )
      default:
        return <WelcomeContent />
    }
  }

  const renderActionButton = () => {
    if (currentScreen === 'welcome') {
      return (
        <View style={styles.actionContainer}>
          <AppButton title="Continue" onPress={handleContinue} type='primary' />
        </View>
      )
    }
    return null
  }

  return (
    <View style={styles.container}>
      {renderContent()}
      {renderActionButton()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
})
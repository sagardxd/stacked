import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { AppText } from '@/components/app-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { OnboardingButton } from './onboarding-button'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'

const { width, height } = Dimensions.get('window')

interface StoryData {
  title: string
  subtitle: string
  icon: string
  color: string 
  gif: string
}

const storyData: StoryData[] = [
  {
    title: 'Secure Savings',
    subtitle: 'Lock your assets safely and redeem whenever you need them',
    icon: 'lock-closed',
    color: '#4CAF50',
    gif: require('@/assets/gifs/piggy-bank.gif')
  },
  {
    title: 'Smart SIP',
    subtitle: 'Invest every month with flexibility to pause or withdraw anytime',
    icon: 'calendar',
    color: '#2196F3',
    gif: require('@/assets/gifs/piggy-bank.gif')
  },
  {
    title: 'Trusted Yield',
    subtitle: 'Earn stable returns through validators you can trust',
    icon: 'shield-checkmark',
    color: '#FF9800',
    gif: require('@/assets/gifs/piggy-bank.gif')
  }
]


interface StoryComponentProps {
  onClose: () => void
  onComplete: () => void
}

const STORY_DURATION = 5000

export function StoryComponent({ onClose, onComplete }: StoryComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const textColor = useThemeColor({}, 'text')
  const progressValues = useRef(storyData.map(() => useSharedValue(0))).current
  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)

  // Initialize progress for current story
  useEffect(() => {
    startProgress()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentIndex])

  const startProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    startTimeRef.current = Date.now()
    pausedTimeRef.current = 0

    const updateProgress = () => {
      if (isPaused) return

      const elapsed = Date.now() - startTimeRef.current - pausedTimeRef.current
      const progressPercent = Math.min((elapsed / STORY_DURATION) * 100, 100)

      progressValues[currentIndex].value = withTiming(progressPercent, { duration: 50 })

      if (progressPercent >= 100) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        goToNextStory()
      }
    }

    intervalRef.current = setInterval(updateProgress, 50)
  }

  const pauseProgress = () => {
    setIsPaused(true)
    if (!pausedTimeRef.current) {
      pausedTimeRef.current = Date.now()
    }
  }

  const resumeProgress = () => {
    if (isPaused && pausedTimeRef.current) {
      const pauseDuration = Date.now() - pausedTimeRef.current
      startTimeRef.current += pauseDuration
      pausedTimeRef.current = 0
      setIsPaused(false)
    }
  }

  const goToNextStory = () => {
    if (currentIndex < storyData.length - 1) {
      // Mark current story as complete
      progressValues[currentIndex].value = withTiming(100, { duration: 100 })
      setCurrentIndex(currentIndex + 1)
    } else {
      onComplete()
    }
  }

  const goToPreviousStory = () => {
    if (currentIndex > 0) {
      // Reset current story progress
      progressValues[currentIndex].value = withTiming(0, { duration: 100 })
      setCurrentIndex(currentIndex - 1)
      // Reset previous story progress to start again
      progressValues[currentIndex - 1].value = withTiming(0, { duration: 100 })
    }
  }

  const handleScreenPress = (event: any) => {
    const { locationX } = event.nativeEvent
    const screenWidth = Dimensions.get('window').width

    if (locationX < screenWidth / 2) {
      // Left side - previous
      goToPreviousStory()
    } else {
      // Right side - next
      if (currentIndex < storyData.length - 1) {
        goToNextStory()
      } else {
        onComplete()
      }
    }
  }

  const handlePressIn = () => {
    pauseProgress()
  }

  const handlePressOut = () => {
    resumeProgress()
  }

  const handleConnectWallet = () => {
    console.log('Connect Wallet pressed')
    onComplete()
  }

  const renderProgressBars = () => (
    <View style={styles.progressContainer}>
      {storyData.map((_, index) => {
        const progressStyle = useAnimatedStyle(() => ({
          width: `${progressValues[index].value}%`,
        }))

        return (
          <View key={index} style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { backgroundColor: 'rgba(255, 255, 255, 0.3)' }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  progressStyle,
                  { backgroundColor: textColor }
                ]}
              />
              {/* Show completed state for previous stories */}
              {index < currentIndex && (
                <View style={[styles.progressFill, styles.completedProgress, { backgroundColor: textColor }]} />
              )}
            </View>
          </View>
        )
      })}
    </View>
  )

  const currentStory = storyData[currentIndex]

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bars */}
      {renderProgressBars()}

      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color={textColor} />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.touchArea}
          onPress={handleScreenPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View style={styles.body}>
            <Image
              style={styles.gifContainer}
              source={currentStory.gif}
              autoplay={true}
            />

            <View style={styles.textContainer}>
              <AppText type="subheading" >{currentStory.title}</AppText>
              <AppText type="body" style={styles.subtitleText}>{currentStory.subtitle}</AppText>
            </View>
          </View>
        </TouchableOpacity>

        {/* Wallet Connect Button - Only on last story */}
        {currentIndex === storyData.length - 1 && (
          <View style={styles.buttonContainer}>
            <OnboardingButton title="Connect Wallet" onPress={handleConnectWallet} />
          </View>
        )}
      </View>

      {/* Touch indicators */}
      <View style={styles.touchIndicators}>
        <View style={styles.leftTouchArea} />
        <View style={styles.rightTouchArea} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161514',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    gap: 4,
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBar: {
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 1.5,
    top: 0,
    left: 0,
  },
  completedProgress: {
    width: '100%',
  },
  closeButton: {
    paddingTop: 10,
    paddingHorizontal: 24,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
  },
  touchArea: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    gap:20
  },
  gifContainer: {
    width: 250,
    height: 250,
  },
  textContainer: {
    gap: 4,
    alignItems: 'center',
    maxWidth: width * 0.8,
    textAlign:'center'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  touchIndicators: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    pointerEvents: 'none',
  },
  leftTouchArea: {
    flex: 1,
  },
  rightTouchArea: {
    flex: 1,
  },
  subtitleText: {
    textAlign: 'center'
  }
})
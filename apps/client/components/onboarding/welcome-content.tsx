import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AppText } from '@/components/app-text'
import Flash from '@/assets/images/onboarding/flash.svg'
import { Image, ImageBackground } from 'expo-image'

export function WelcomeContent() {

  return (
    <View style={styles.contentContainer}>
      <ImageBackground source={require('@/assets/images/background/bg.png')} style={StyleSheet.absoluteFillObject} />
      <View style={styles.content}>
        <View>
          {/* <Image source={require("../../assets/images/background/card.png")}
            style={{ width: 320, height: 320 }}
          /> */}
          {/* <AppText type="heading" style={styles.heading}>stacked</AppText> */}
        </View>

        <View style={styles.textContainer}>
          <View style={styles.mainHeadingContainer}>
            <View style={styles.leftTextContainer}>
              <AppText type="subheading">Traditional</AppText>
              <AppText type="subheading">On-Chain </AppText>
            </View>
            <View style={styles.investmentsWithIconContainer}>
              <AppText type="subheading">Investments</AppText>
              <Flash />
            </View>
          </View>


          <AppText type='body'>
            Invest simply, securely, and on your terms.
          </AppText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    paddingTop: 160,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 38,
    textAlign: 'center'
  },
  textContainer: {
    gap: 12,
  },
  leftTextContainer: {
    flexDirection: 'column',
    gap: 10
  },
  mainHeadingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  investmentsWithIconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4
  },
  heading: {
    textAlign: 'center'
  }
})

import { Link, Stack } from 'expo-router'
import { StyleSheet } from 'react-native'

import { AppText } from '@/components/app-text'

import { AppView } from '@/components/app-view'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <AppView style={styles.container}>
        <AppText type="heading" style={{ textAlign: 'center' }}>
          This screen does not exist.
        </AppText>
        <Link href="/(tabs)/home" style={styles.link}>
          <AppText type="body">Go to home screen!</AppText>
        </Link>
      </AppView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})

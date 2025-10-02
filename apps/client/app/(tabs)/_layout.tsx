import { Tabs } from 'expo-router'
import React from 'react'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* <Tabs.Screen name="home" options={{ tabBarItemStyle: { display: 'none' } }} /> */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="home" color={color} />,
        }}
      />
        <Tabs.Screen
          name="portfolio"
          options={{
            title: 'Portfolio',
            tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="wallet" color={color} />,
          }}
        /> 
    </Tabs>
  )
}

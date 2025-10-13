import { Tabs, usePathname } from 'expo-router'
import React from 'react'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import AppTabBar from '@/components/tabs/AppTabBar'

export default function TabLayout() {

  return (
    <Tabs 
      tabBar={props => <AppTabBar {...props}/>}
    screenOptions={{
      headerShown: false,
    }}>
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
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="settings" color={color} />,
        }}
      />
    </Tabs>
  )
}

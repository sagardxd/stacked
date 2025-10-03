import { Tabs, usePathname } from 'expo-router'
import React from 'react'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'

export default function TabLayout() {
  const pathname = usePathname()
  
  // Hide tab bar on any sub-routes
  const shouldHideTabs = pathname.split('/').length > 2
  return (
    <Tabs screenOptions={{ headerShown: false ,
      tabBarStyle : shouldHideTabs ? {display: 'none'} : undefined
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
    </Tabs>
  )
}

import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.surface,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='budget'
        options={{
          title: 'Budget',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='wallet-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='savings'
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='flag-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='loans'
        options={{
          title: 'Loans',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='card-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='forecast'
        options={{
          title: 'Forecast',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='analytics-outline' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

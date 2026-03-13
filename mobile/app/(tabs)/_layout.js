import { Tabs } from 'expo-router';
import { Home, ShoppingCart, CreditCard, History, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Buy',
          tabBarIcon: ({ color, size }) => <ShoppingCart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="topup"
        options={{
          title: 'Top-up',
          tabBarIcon: ({ color, size }) => <CreditCard color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Log',
          tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

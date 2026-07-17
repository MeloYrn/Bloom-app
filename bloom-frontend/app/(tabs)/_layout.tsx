import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: () => null }} />
      <Tabs.Screen name="track" options={{ title: 'Track', tabBarIcon: () => null }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: () => null }} />
      <Tabs.Screen name="discharge" options={{ title: 'Discharge', tabBarIcon: () => null }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn', tabBarIcon: () => null }} />
    </Tabs>
  );
}

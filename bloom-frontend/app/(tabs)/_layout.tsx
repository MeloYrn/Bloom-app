import { Tabs } from 'expo-router';
import { Text } from 'react-native';

const tabIcon = (emoji: string) => ({ color }: { color: string }) => (
  <Text style={{ fontSize: 22, color }}>{emoji}</Text>
);

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: ' Home', tabBarIcon: tabIcon('🏠') }} />
      <Tabs.Screen name="track" options={{ title: ' Track', tabBarIcon: tabIcon('📍') }} />
      <Tabs.Screen name="community" options={{ title: ' Community', tabBarIcon: tabIcon('💬') }} />
      <Tabs.Screen name="discharge" options={{ title: ' Discharge', tabBarIcon: tabIcon('🩺') }} />
      <Tabs.Screen name="learn" options={{ title: ' Learn', tabBarIcon: tabIcon('📚') }} />
      <Tabs.Screen name="profile" options={{ title: ' Profile', tabBarIcon: tabIcon('👤') }} /> 
    </Tabs>
  );
}
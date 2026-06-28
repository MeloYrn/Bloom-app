import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Discharge' }} />
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
    </Tabs> 
  );
}
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  index: { active: 'home', inactive: 'home-outline' },
  track: { active: 'calendar', inactive: 'calendar-outline' },
  community: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  discharge: { active: 'water', inactive: 'water-outline' },
  learn: { active: 'book', inactive: 'book-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

function tabIcon(routeName: string) {
  return ({ color, focused, size }: { color: string; focused: boolean; size: number }) => {
    const icons = TAB_ICONS[routeName];
    return <Ionicons name={focused ? icons.active : icons.inactive} size={size ?? 22} color={color} />;
  };
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.pink,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surfaceSolid,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('index') }} />
      <Tabs.Screen name="track" options={{ title: 'Track', tabBarIcon: tabIcon('track') }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: tabIcon('community') }} />
      <Tabs.Screen name="discharge" options={{ title: 'Discharge', tabBarIcon: tabIcon('discharge') }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn', tabBarIcon: tabIcon('learn') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('profile') }} />
    </Tabs>
  );
}
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, spacing, radius, type } from '../../constants/theme';
import { Screen } from '../../components/ui/Screen';
import { ScreenHeader } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';

const CATEGORIES = ['All', 'Cycle basics', 'Discharge', 'Pain relief', 'Contraceptives'];

// TODO: replace with real article data.
const ARTICLES: { id: string; category: string; title: string; desc: string; minutes: number; icon: React.ComponentProps<typeof Ionicons>['name']; tint: string }[] = [
  { id: '1', category: 'Cycle basics', title: 'Understanding your menstrual cycle', desc: 'Learn about the 4 phases of your cycle and what happens in your body.', minutes: 3, icon: 'calendar-outline', tint: colors.pink },
  { id: '2', category: 'Discharge', title: 'What is normal discharge?', desc: 'Discharge changes throughout your cycle. Learn what is normal.', minutes: 4, icon: 'water-outline', tint: colors.fertile },
  { id: '3', category: 'Pain relief', title: 'Managing period cramps', desc: 'Practical tips including heat therapy, diet, and exercise.', minutes: 5, icon: 'bandage-outline', tint: colors.gold },
  { id: '4', category: 'Contraceptives', title: 'Contraceptive options in Ghana', desc: 'An overview of birth control methods available locally.', minutes: 6, icon: 'medkit-outline', tint: colors.purple },
];

export default function Learn() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const filtered = ARTICLES.filter((a) => (category === 'All' || a.category === category) && a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <ScreenHeader title="Health Library" subtitle="Medically informed, culturally relevant" accentColor={colors.gold} />

        <View style={styles.section}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={16} color={colors.textMuted} />
            <TextInput value={query} onChangeText={setQuery} placeholder="Search articles…" placeholderTextColor={colors.textFaint} style={styles.searchInput} />
          </View>
        </View>

        <View style={styles.categoryRow}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} selected={category === c} color={colors.gold} onPress={() => setCategory(c)} />
          ))}
        </View>

        <View style={styles.section}>
          {filtered.map((a) => (
            <Pressable key={a.id} style={styles.article}>
              <View style={[styles.iconWrap, { backgroundColor: a.tint + '2E' }]}>
                <Ionicons name={a.icon} size={20} color={a.tint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.caption, { color: a.tint }]}>{a.category.toUpperCase()}</Text>
                <Text style={[type.h3, { marginTop: 2 }]}>{a.title}</Text>
                <Text style={[type.bodyMuted, { marginTop: 2 }]}>{a.desc}</Text>
                <Text style={[type.caption, { marginTop: spacing.sm }]}>{a.minutes} min read</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: spacing.lg },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, height: 44, paddingHorizontal: spacing.md, marginBottom: spacing.md,
  },
  searchInput: { flex: 1, color: colors.text },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  article: {
    flexDirection: 'row', gap: spacing.sm, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm,
  },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen } from '../../components/ui/Screen';
import { Card, ScreenHeader } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { EmptyState } from '../../components/ui/PhaseTipCard';
import { colors, spacing, radius, type } from '../../constants/theme';

const CATEGORIES = ['All', 'Cycle basics', 'Discharge', 'Pain relief', 'Contraceptives'];

const CATEGORY_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  'Cycle basics': 'water-outline',
  'Discharge': 'water-outline',
  'Pain relief': 'leaf-outline',
  'Contraceptives': 'medkit-outline',
};

const ARTICLES = [
  {
    id: '1',
    category: 'Cycle basics',
    title: 'Understanding Your Menstrual Cycle',
    summary: 'A breakdown of the four phases of the cycle and what happens in each.',
    readTime: '4 min read',
  },
  {
    id: '2',
    category: 'Discharge',
    title: 'What Is Normal Discharge?',
    summary: 'How to tell healthy discharge from signs that are worth checking with a doctor.',
    readTime: '3 min read',
  },
  {
    id: '3',
    category: 'Pain relief',
    title: 'Managing Period Cramps Naturally',
    summary: 'Heat, movement, and diet strategies that can ease cramping.',
    readTime: '5 min read',
  },
  {
    id: '4',
    category: 'Contraceptives',
    title: 'Comparing Birth Control Options',
    summary: 'An overview of common contraceptive methods and how they work.',
    readTime: '6 min read',
  },
];

export default function LearnScreen() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const filtered = ARTICLES.filter(
    (a) => (category === 'All' || a.category === category) && a.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <ScreenHeader title="Health Library" subtitle="Medically informed, culturally relevant" accentColor={colors.gold} />

        <View style={styles.section}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={16} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search articles…"
              placeholderTextColor={colors.textFaint}
              style={styles.searchInput}
            />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow} contentContainerStyle={{ paddingRight: spacing.lg, gap: spacing.sm }}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} selected={category === c} color={colors.gold} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>

        <View style={styles.section}>
          {filtered.length === 0 ? (
            <EmptyState icon="book-outline" title="No articles found" message="Try a different search term or category." />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedArticle(item)}>
                  <Card style={styles.card}>
                    <View style={styles.cardRow}>
                      <View style={styles.cardIconWrap}>
                        <Ionicons name={CATEGORY_ICONS[item.category] || 'document-text-outline'} size={20} color={colors.gold} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={type.caption}>{item.category.toUpperCase()}</Text>
                        <Text style={[type.h3, { marginTop: 2 }]}>{item.title}</Text>
                        <Text style={[type.bodyMuted, { marginTop: 4 }]}>{item.summary}</Text>
                        <Text style={[type.caption, { marginTop: 6 }]}>{item.readTime}</Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>

      {selectedArticle && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView>
              <View style={styles.modalIconWrap}>
                <Ionicons
                  name={CATEGORY_ICONS[selectedArticle.category] || 'document-text-outline'}
                  size={24}
                  color={colors.gold}
                />
              </View>
              <Text style={[type.caption, { textAlign: 'center' }]}>{selectedArticle.category.toUpperCase()}</Text>
              <Text style={[type.h1, { textAlign: 'center', marginTop: 6 }]}>{selectedArticle.title}</Text>
              <Text style={[type.caption, { textAlign: 'center', marginTop: 6, marginBottom: spacing.md }]}>
                {selectedArticle.readTime}
              </Text>
              <Text style={type.body}>{selectedArticle.summary}</Text>
              <Text style={[type.body, { marginTop: spacing.sm }]}>
                This is placeholder content for the full article. In a future update, this section will
                contain the complete, medically-reviewed article text with detailed information, tips, and
                guidance related to {selectedArticle.title.toLowerCase()}.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedArticle(null)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  categoryRow: { marginBottom: spacing.md, paddingLeft: spacing.lg },
  card: { marginBottom: spacing.sm },
  cardRow: { flexDirection: 'row', gap: spacing.md },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(240,184,96,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surfaceSolid,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalIconWrap: {
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(240,184,96,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  modalCloseBtn: {
    backgroundColor: colors.pink,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  modalCloseText: { color: '#fff', fontWeight: '700' },
});
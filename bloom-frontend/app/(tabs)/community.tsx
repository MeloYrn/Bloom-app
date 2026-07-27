import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, spacing, radius, type } from '../../constants/theme';
import { Screen } from '../../components/ui/Screen';
import { ScreenHeader } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { EmptyState } from '../../components/ui/PhaseTipCard';

const CATEGORIES = ['mental-health', 'contraceptives', 'first-timers'];

// TODO: replace with real posts from your API / websocket store.
const mockPosts = [
  { id: '1', author: 'JadeZinnia7', category: 'contraceptives', body: 'Does anyone have advice on choosing a contraceptive method for the first time?', hearts: 3 },
];

export default function Community() {
  const [category, setCategory] = useState('contraceptives');
  const [draft, setDraft] = useState('');
  const posts = mockPosts.filter((p) => p.category === category);

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScreenHeader
          title="Community"
          subtitle="A safe space to share and be heard"
          accentColor={colors.purple}
          right={
            <View style={styles.anonBadge}>
              <Ionicons name="lock-closed" size={12} color={colors.purple} />
              <Text style={[type.caption, { color: colors.purple }]}>Anonymous</Text>
            </View>
          }
        />

        <View style={styles.categoryRow}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={`#${c}`} selected={category === c} color={colors.purple} onPress={() => setCategory(c)} />
          ))}
        </View>

        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
          ListEmptyComponent={
            <EmptyState icon="chatbubble-ellipses-outline" title="Nothing here yet" message={`Be the first to share something in #${category}. It's anonymous.`} />
          }
          renderItem={({ item }) => (
            <View style={styles.post}>
              <View style={styles.postHeader}>
                <View style={styles.postAvatar}>
                  <Text style={styles.postAvatarText}>{item.author.slice(0, 2).toUpperCase()}</Text>
                </View>
                <Text style={type.h3}>{item.author}</Text>
              </View>
              <Text style={[type.body, { marginTop: spacing.xs }]}>{item.body}</Text>
              <View style={styles.postFooter}>
                <View style={styles.postAction}>
                  <Ionicons name="heart-outline" size={16} color={colors.pink} />
                  <Text style={type.bodyMuted}>{item.hearts}</Text>
                </View>
                <View style={styles.postAction}>
                  <Ionicons name="flag-outline" size={16} color={colors.textMuted} />
                  <Text style={type.bodyMuted}>Report</Text>
                </View>
              </View>
            </View>
          )}
        />

        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Share anonymously…"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
          />
          <Pressable style={styles.sendBtn} onPress={() => setDraft('')}>
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  anonBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(138,92,246,0.14)', paddingHorizontal: 10, height: 28, borderRadius: radius.pill,
  },
  categoryRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  post: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  postAvatar: { width: 30, height: 30, borderRadius: radius.pill, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  postAvatarText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  postFooter: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm },
  postAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  composer: {
    flexDirection: 'row', gap: spacing.sm, padding: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: 'rgba(18,14,28,0.9)',
  },
  input: { flex: 1, height: 44, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.07)', paddingHorizontal: spacing.md, color: colors.text },
  sendBtn: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
});

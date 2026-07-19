import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';

const ARTICLES = [
  { id: '1', title: 'Understanding Your Menstrual Cycle', category: 'Cycle Basics', summary: 'Learn about the 4 phases of your cycle and what happens in your body.', readTime: '3 min read', emoji: '📅' },
  { id: '2', title: 'What is Normal Discharge?', category: 'Discharge', summary: 'Discharge changes throughout your cycle. Learn what is normal.', readTime: '4 min read', emoji: '💧' },
  { id: '3', title: 'Managing Period Cramps', category: 'Pain Relief', summary: 'Practical tips including heat therapy, diet, and exercise.', readTime: '5 min read', emoji: '🩹' },
  { id: '4', title: 'Contraceptive Options in Ghana', category: 'Contraceptives', summary: 'An overview of birth control methods available locally.', readTime: '6 min read', emoji: '💊' },
  { id: '5', title: 'PMS and Your Mood', category: 'Mental Health', summary: 'Understand the hormonal link between PMS and mood swings.', readTime: '4 min read', emoji: '🧠' },
  { id: '6', title: 'Foods That Help During Your Period', category: 'Nutrition', summary: 'Foods that may reduce cramps and boost your energy.', readTime: '3 min read', emoji: '🥗' },
];

const CATEGORIES = ['All', 'Cycle Basics', 'Discharge', 'Pain Relief', 'Nutrition', 'Contraceptives', 'Mental Health'];

export default function LearnScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Library</Text>
        <Text style={styles.headerSub}>Medically informed, culturally relevant</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item}
        style={styles.catBar}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catChip, activeCategory === item && styles.catChipActive]}
            onPress={() => setActiveCategory(item)}
          >
            <Text style={[styles.catText, activeCategory === item && styles.catTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelectedArticle(item)}>
            <Text style={styles.cardEmoji}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardCategory}>{item.category}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSummary}>{item.summary}</Text>
              <Text style={styles.cardTime}>{item.readTime}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {selectedArticle && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView>
              <Text style={styles.modalEmoji}>{selectedArticle.emoji}</Text>
              <Text style={styles.modalCategory}>{selectedArticle.category}</Text>
              <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
              <Text style={styles.modalReadTime}>{selectedArticle.readTime}</Text>
              <Text style={styles.modalBody}>{selectedArticle.summary}</Text>
              <Text style={styles.modalBody}>
                This is placeholder content for the full article. In a future update, this section will contain the complete, medically-reviewed article text with detailed information, tips, and guidance related to {selectedArticle.title.toLowerCase()}.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedArticle(null)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  header: { backgroundColor: '#E65100', padding: 24, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 13, color: '#FFE0B2', marginTop: 4 },
  searchWrap: { padding: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#EEE' },
  searchInput: { backgroundColor: '#FAFAFA', borderWidth: 2, borderColor: '#E0E0E0',
                 borderRadius: 12, padding: 10, fontSize: 14 },
  catBar: { paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#EEE' },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, borderWidth: 2,
             borderColor: '#E0E0E0', marginRight: 8 },
  catChipActive: { backgroundColor: '#FF6D00', borderColor: '#FF6D00' },
  catText: { fontSize: 12, fontWeight: '600', color: '#777' },
  catTextActive: { color: '#fff' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
          borderWidth: 1, borderColor: '#EEE', elevation: 2 },
  cardEmoji: { fontSize: 32, marginRight: 14 },
  cardCategory: { fontSize: 10, fontWeight: 'bold', color: '#E65100', textTransform: 'uppercase', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  cardSummary: { fontSize: 12, color: '#777', marginBottom: 6, lineHeight: 17 },
  cardTime: { fontSize: 11, color: '#999' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, maxHeight: '80%' },
  modalEmoji: { fontSize: 40, textAlign: 'center', marginBottom: 10 },
  modalCategory: { fontSize: 11, fontWeight: 'bold', color: '#E65100', textTransform: 'uppercase', textAlign: 'center', marginBottom: 6 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', marginBottom: 6 },
  modalReadTime: { fontSize: 12, color: '#999', textAlign: 'center', marginBottom: 16 },
  modalBody: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 14 },
  modalCloseBtn: { backgroundColor: '#E65100', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  modalCloseText: { color: '#fff', fontWeight: 'bold' },
});
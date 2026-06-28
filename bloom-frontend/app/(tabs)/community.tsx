import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView, 
  Platform,
} from 'react-native';
import { Client } from '@stomp/stompjs';
// @ts-ignore: no declaration file for sockjs-client
import SockJS from 'sockjs-client';
import { communityApi } from '../../services/api';


const BASE_WS = 'http://172.20.10.3:8083';

const CHANNELS = ['general', 'cramps', 'discharge', 'mental-health', 'contraceptives', 'first-timers'];

type Post = {
  id: string;
  pseudonym: string;
  channel: string;
  content: string;
  upvotes: number;
  createdAt?: string;
};

export default function CommunityScreen() {
  const [channel, setChannel] = useState('general');
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState(''); 
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    // Load existing posts for this channel
    communityApi.get(`/api/community/posts/${channel}`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.log('Failed to load posts:', err.message));

    // Disconnect previous connection if switching channels
    if (stompClient.current) {
      stompClient.current.deactivate();
    }

    // Connect to WebSocket
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_WS}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/channel/${channel}`, (msg) => {
          const newPost = JSON.parse(msg.body);
          setPosts((prev) => [newPost, ...prev]);
        });
      },
      onStompError: (frame) => {
        console.log('STOMP error:', frame);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [channel]);

  const sendPost = async () => {
    if (!message.trim()) return;
    try {
      await communityApi.post('/api/community/posts', { channel, content: message });
      setMessage('');
    } catch (err) {
      console.log('Failed to send post:', err);
    }
  };

  const upvote = async (postId: string) => {
    try {
      await communityApi.post(`/api/community/posts/${postId}/upvote`);
    } catch (err) {
      console.log('Failed to upvote:', err);
    }
  };

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSub}>A safe space to share and be heard</Text>
        <View style={styles.anonBadge}>
          <Text style={styles.anonBadgeText}>🔒 You are anonymous here</Text>
        </View>
      </View>

      <FlatList
        horizontal
        data={CHANNELS}
        keyExtractor={(item) => item}
        style={styles.channelBar}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.channelBtn, channel === item && styles.channelBtnActive]}
            onPress={() => setChannel(item)}
          >
            <Text style={[styles.channelText, channel === item && styles.channelTextActive]}>
              #{item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postMeta}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(item.pseudonym)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pseudonym}>{item.pseudonym}</Text>
                <View style={styles.channelTag}>
                  <Text style={styles.channelTagText}>#{item.channel}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.postText}>{item.content}</Text>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => upvote(item.id)}>
                <Text style={styles.actionText}>💗 {item.upvotes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionText}>🚩 Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Share anonymously..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendPost}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#6A1B9A', padding: 24, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 13, color: '#E1BEE7', marginTop: 4 },
  anonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  anonBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  channelBar: { paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#EEE' },
  channelBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: '#E0E0E0', marginRight: 8 },
  channelBtnActive: { backgroundColor: '#6A1B9A', borderColor: '#6A1B9A' },
  channelText: { fontSize: 13, fontWeight: '600', color: '#777' },
  channelTextActive: { color: '#fff' },
  postCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#EEE', elevation: 1 },
  postMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#C2185B', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  pseudonym: { fontSize: 14, fontWeight: 'bold', color: '#6A1B9A' },
  channelTag: { backgroundColor: '#FCE4EC', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 2 },
  channelTagText: { fontSize: 10, color: '#C2185B', fontWeight: '700' },
  postText: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 10 },
  postActions: { flexDirection: 'row', gap: 16 },
  actionBtn: {},
  actionText: { fontSize: 13, color: '#777', fontWeight: '600' },
  inputBar: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: '#EEE', alignItems: 'flex-end', backgroundColor: '#fff' },
  input: { flex: 1, borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100, fontSize: 14, backgroundColor: '#FAFAFA' },
  sendBtn: { backgroundColor: '#C2185B', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
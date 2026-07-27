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
  pseudonym?: string | null;
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

  const getInitials = (name?: string | null) => {
    const safeName = (name ?? 'Anonymous').trim();
    if (!safeName) return 'AN';
    return safeName.substring(0, 2).toUpperCase();
  };

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

      <FlatList
        horizontal
        data={CHANNELS}
        keyExtractor={(item) => item}
        style={styles.channelBar}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item}
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
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>💬</Text>
            <Text style={{ color: '#999', textAlign: 'center' }}>
              No posts yet in this channel.{'\n'}Be the first to share!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View key={item.id} style={styles.postCard}>
            <View style={styles.postMeta}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(item.pseudonym)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pseudonym}>{item.pseudonym || 'Anonymous'}</Text>
                <View style={styles.channelTag}>
                  <Text style={styles.channelTagText}>#{item.channel}</Text>
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

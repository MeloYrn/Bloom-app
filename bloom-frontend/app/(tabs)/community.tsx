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
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen } from '../../components/ui/Screen';
import { ScreenHeader } from '../../components/ui/Card';
import { colors, spacing, radius, type } from '../../constants/theme';
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
    communityApi
      .get(`/api/community/posts/${channel}`)
      .then((res) => setPosts(res.data))
      .catch((err: any) => console.log('Failed to load posts:', err?.message ?? err));

    if (stompClient.current) {
      stompClient.current.deactivate();
    }

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
    } catch (err: any) {
      console.log('Failed to send post:', err?.message ?? err);
    }
  };

  const upvote = async (postId: string) => {
    try {
      await communityApi.post(`/api/community/posts/${postId}/upvote`);
    } catch (err: any) {
      console.log('Failed to upvote:', err?.message ?? err);
    }
  };

  const getInitials = (name?: string | null) => {
    const safeName = (name ?? 'Anonymous').trim();
    if (!safeName) return 'AN';
    return safeName.substring(0, 2).toUpperCase();
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScreenHeader
          title="Community"
          subtitle="A safe space to share and be heard"
          accentColor={colors.purple}
          right={
            <View style={styles.anonBadge}>
              <Ionicons name="lock-closed-outline" size={12} color={colors.purple} />
              <Text style={[type.caption, { color: colors.purple, marginLeft: 4 }]}>Anonymous</Text>
            </View>
          }
        />

        <FlatList
          horizontal
          data={CHANNELS}
          keyExtractor={(item) => item}
          style={styles.channelBar}
          contentContainerStyle={styles.channelBarContent}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.channelBtn, channel === item && styles.channelBtnActive]}
              onPress={() => setChannel(item)}
            >
              <Text style={[styles.channelText, channel === item && styles.channelTextActive]}>#{item}</Text>
            </TouchableOpacity>
          )}
        />

        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIconWrap}>
                <Ionicons name="chatbubbles-outline" size={26} color={colors.textMuted} />
              </View>
              <Text style={styles.emptyStateText}>No posts yet in this channel.{'\n'}Be the first to share!</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <View style={styles.postMeta}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(item.pseudonym)}</Text>
                </View>
                <View style={styles.postDetails}>
                  <Text style={styles.pseudonym}>{item.pseudonym || 'Anonymous'}</Text>
                  <View style={styles.channelTag}>
                    <Text style={styles.channelTagText}>#{item.channel}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.postContent}>{item.content}</Text>
              <View style={styles.postFooter}>
                <TouchableOpacity style={styles.postAction} onPress={() => upvote(item.id)}>
                  <Ionicons name="chevron-up" size={14} color={colors.text} />
                  <Text style={styles.postActionText}>{item.upvotes}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <View style={styles.composer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Share anonymously…"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendPost}>
            <Ionicons name="send" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  anonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138,92,246,0.14)',
    paddingHorizontal: 10,
    height: 28,
    borderRadius: radius.pill,
  },
  channelBar: { maxHeight: 56 },
  channelBarContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  channelBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginRight: spacing.sm,
  },
  channelBtnActive: { backgroundColor: colors.purple },
  channelText: { color: colors.textFaint, fontWeight: '600' },
  channelTextActive: { color: '#FFFFFF' },
  listContent: { padding: spacing.lg, flexGrow: 1 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyStateIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyStateText: { color: colors.textFaint, textAlign: 'center', lineHeight: 20 },
  postCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  postMeta: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700' },
  postDetails: { flex: 1 },
  pseudonym: { color: colors.text, fontWeight: '600' },
  channelTag: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  channelTagText: { color: colors.textFaint, fontSize: 12 },
  postContent: { color: colors.text, marginTop: spacing.sm, lineHeight: 20 },
  postFooter: { marginTop: spacing.sm },
  postAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postActionText: { color: colors.text, fontSize: 12 },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: 'rgba(18,14,28,0.9)',
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
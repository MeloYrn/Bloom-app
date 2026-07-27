import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/auth.store';

export default function ProfileScreen() {
  const { displayName, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{displayName?.charAt(0).toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.name}>{displayName || 'User'}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuText}>Notification Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔒</Text>
            <Text style={styles.menuText}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>❓</Text>
            <Text style={styles.menuText}>Help & Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>ℹ️</Text>
            <Text style={styles.menuText}>About Bloom</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#C2185B', padding: 24, paddingTop: 50, alignItems: 'center' },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  body: { padding: 20 },
  menuSection: { backgroundColor: '#FAFAFA', borderRadius: 16, marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#EEE' },
  menuIcon: { fontSize: 20, marginRight: 14 },
  menuText: { fontSize: 15, color: '#1A1A1A', fontWeight: '500' },
  logoutBtn: { backgroundColor: '#FFEBEE', padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#C62828', fontWeight: 'bold', fontSize: 15 },
});
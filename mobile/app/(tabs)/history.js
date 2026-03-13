import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import Config from '../../constants/Config';

export default function History() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const sessRes = await axios.get(`${Config.API_BASE}/session`);
      const uid = sessRes.data.rfid_uid;
      
      if (uid) {
        const res = await axios.get(`${Config.API_BASE}/history/${uid}`);
        setLogs(res.data);
      }
    } catch (error) {
      console.error('History fetch error:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Log</Text>
      
      {logs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recent activities found.</Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
          renderItem={({ item }) => (
            <View style={styles.logCard}>
              <View style={styles.logHeader}>
                <Text style={styles.logTime}>
                  {new Date(item.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <View style={[styles.badge, { backgroundColor: item.type === 'credit' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                  <Text style={[styles.badgeText, { color: item.type === 'credit' ? '#22c55e' : '#ef4444' }]}>
                    {item.type.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.logDesc}>{item.description}</Text>
              <Text style={[styles.logAmount, { color: item.type === 'credit' ? '#22c55e' : '#fff' }]}>
                {item.type === 'credit' ? '+' : '-'}{item.amount} Credits
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  logCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logTime: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  logDesc: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  logAmount: {
    fontSize: 18,
    fontWeight: '800',
  },
});

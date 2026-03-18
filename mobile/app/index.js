import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Config from '../constants/Config';
import ScanLock from '../components/ScanLock';

export default function EntryPoint() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const router = useRouter();

  const checkSession = async () => {
    try {
      const response = await axios.get(`${Config.API_BASE}/session`, { timeout: 3000 });
      const data = response.data;
      setErrorStatus(null);

      const activeUid = data.rfid_uid || data.uid;

      if (activeUid) {
        setSession(data);
        setIsLoading(false);
        // Navigate to dashboard if session found
        router.replace('/(tabs)/dashboard');
      } else {
        setSession(null);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorStatus(error.message);
      console.error('Session Check Failed:', error);
      setSession(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkSession();
    
    // Poll every 2 seconds
    const interval = setInterval(checkSession, 2000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={{ flex: 1 }}>
        <ScanLock />
        <View style={{ position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' }}>
          <Text style={{ color: '#64748b', fontSize: 10 }}>Target API: {Config.API_BASE}</Text>
          {errorStatus && <Text style={{ color: '#ef4444', fontSize: 10 }}>Error: {errorStatus}</Text>}
        </View>
      </View>
    );
  }

  // If session exists, it will navigate via the router.replace in checkSession
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

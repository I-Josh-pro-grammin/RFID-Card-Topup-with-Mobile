import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Config from '../constants/Config';
import ScanLock from '../components/ScanLock';

export default function EntryPoint() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkSession = async () => {
    try {
      const response = await axios.get(`${Config.API_BASE}/session`);
      const data = response.data;

      if (data.rfid_uid) {
        setSession(data);
        setIsLoading(false);
        // Navigate to dashboard if session found
        router.replace('/(tabs)/dashboard');
      } else {
        setSession(null);
        setIsLoading(false);
      }
    } catch (error) {
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
    return <ScanLock />;
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

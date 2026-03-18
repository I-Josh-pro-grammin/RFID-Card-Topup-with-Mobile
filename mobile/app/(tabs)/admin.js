import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import axios from 'axios';
import Config from '../../constants/Config';
import { ShieldAlert, RefreshCw, Lock, Unlock } from 'lucide-react-native';

export default function Admin() {
  const [oldUid, setOldUid] = useState('');
  const [newUid, setNewUid] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReplace = async () => {
    if (!oldUid || !newUid) return Alert.alert('Error', 'Please fill both UIDs');
    
    setIsLoading(true);
    try {
      const res = await axios.post(`${Config.API_BASE}/wallets/replace`, { oldUid, newUid });
      if (res.data.success) {
        Alert.alert('Success', res.data.message || 'Card replaced! Old card blocked.');
        setOldUid('');
        setNewUid('');
      } else {
        Alert.alert('Error', res.data.message || 'Replacement failed');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Replacement failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      const sessRes = await axios.get(`${Config.API_BASE}/session`);
      const currentUid = sessRes.data.rfid_uid;
      
      if (!currentUid) return Alert.alert('Error', 'No active session');

      const confirmMsg = `Are you sure you want to ${status === 'blocked' ? 'Block' : 'Unblock'} this card?`;
      
      if (Platform.OS === 'web') {
        if (window.confirm(confirmMsg)) {
          executeStatusUpdate(currentUid, status);
        }
      } else {
        Alert.alert(
          'Confirm Action',
          confirmMsg,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes, Proceed', onPress: () => executeStatusUpdate(currentUid, status) }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Status update failed');
    }
  };

  const executeStatusUpdate = async (rfidUid, status) => {
    try {
      const res = await axios.post(`${Config.API_BASE}/wallets/status`, { rfidUid, status });
      if (res.data.success) {
        Alert.alert('Success', res.data.message || `Card is now ${status}`);
      } else {
        Alert.alert('Update Failed', res.data.message || 'Check card UID');
      }
    } catch (error) {
      Alert.alert('Error', 'API request failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Card Admin</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Replace Lost Card</Text>
        <Text style={styles.sectionDesc}>Transfer balance and history to a new UID.</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Old Card UID</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. A1B2C3D4"
            placeholderTextColor="#64748b"
            value={oldUid}
            onChangeText={setOldUid}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Card UID</Text>
          <TextInput
            style={styles.input}
            placeholder="Scan new card..."
            placeholderTextColor="#64748b"
            value={newUid}
            onChangeText={setNewUid}
          />
        </View>

        <TouchableOpacity 
          style={styles.actionBtn} 
          onPress={handleReplace}
          disabled={isLoading}
        >
          <RefreshCw color="#fff" size={20} style={{ marginRight: 10 }} />
          <Text style={styles.actionBtnText}>Transfer & Replace</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { borderColor: '#ef4444', marginBottom: 50 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <ShieldAlert color="#ef4444" size={24} style={{ marginRight: 10 }} />
          <Text style={[styles.sectionTitle, { color: '#ef4444', marginBottom: 0 }]}>Security Controls</Text>
        </View>
        <Text style={styles.sectionDesc}>Emergency card blocking for the current active session.</Text>

        <TouchableOpacity 
          style={[styles.securityBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }]} 
          onPress={() => updateStatus('blocked')}
        >
          <Lock color="#ef4444" size={20} style={{ marginRight: 10 }} />
          <Text style={[styles.securityBtnText, { color: '#ef4444' }]}>Block Card</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.securityBtn, { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e', marginTop: 12 }]} 
          onPress={() => updateStatus('active')}
        >
          <Unlock color="#22c55e" size={20} style={{ marginRight: 10 }} />
          <Text style={[styles.securityBtnText, { color: '#22c55e' }]}>Unblock Card</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDesc: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  actionBtn: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  securityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  securityBtnText: {
    fontWeight: '700',
    fontSize: 16,
  },
});

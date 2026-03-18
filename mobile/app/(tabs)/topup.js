import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Config from '../../constants/Config';
import { PlusCircle } from 'lucide-react-native';

const AMOUNTS = [50, 100, 500];

export default function Topup() {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  const handleTopup = async () => {
    setIsLoading(true);
    try {
      const sessRes = await axios.get(`${Config.API_BASE}/session`);
      const uid = sessRes.data.rfid_uid;
      
      if (!uid) {
        Alert.alert('Error', 'No active session');
        return;
      }

      const res = await axios.post(`${Config.API_BASE}/topup`, {
        uid: uid,
        amount: selectedAmount,
        terminal: 'Mobile-Dashboard'
      });

      if (res.data.success) {
        alert('SUCCESS: ' + (res.data.message || `${selectedAmount} Credits added!`));
      } else {
        alert('FAILED: ' + (res.data.message || 'Top-up could not be processed'));
      }
    } catch (error) {
      alert('ERROR: ' + (error.response?.data?.message || error.message || 'Top-up failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Refill Credits</Text>
      <Text style={styles.subtitle}>Select an amount to add to your scanned card immediately.</Text>

      <View style={styles.optionsContainer}>
        {AMOUNTS.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.amountBtn,
              selectedAmount === amount && styles.amountBtnActive
            ]}
            onPress={() => setSelectedAmount(amount)}
          >
            <Text style={[
              styles.amountText,
              selectedAmount === amount && styles.amountTextActive
            ]}>
              {amount} Credits
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.confirmBtn} 
        onPress={handleTopup}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <PlusCircle color="#fff" size={20} style={{ marginRight: 10 }} />
            <Text style={styles.confirmBtnText}>Confirm Top-up</Text>
          </>
        )}
      </TouchableOpacity>
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
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  amountBtn: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  amountBtnActive: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  amountText: {
    color: '#94a3b8',
    fontSize: 20,
    fontWeight: '700',
  },
  amountTextActive: {
    color: '#6366f1',
  },
  confirmBtn: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});

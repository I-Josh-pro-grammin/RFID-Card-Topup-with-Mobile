import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import axios from 'axios';
import Config from '../../constants/Config';
import { ShoppingBag } from 'lucide-react-native';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rfidUid, setRfidUid] = useState(null);

  const fetchData = async () => {
    try {
      const [prodRes, sessRes] = await Promise.all([
        axios.get(`${Config.API_BASE}/products`),
        axios.get(`${Config.API_BASE}/session`)
      ]);
      setProducts(prodRes.data);
      setRfidUid(sessRes.data.rfid_uid || sessRes.data.uid);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buyService = async (productId, name) => {
    if (!rfidUid) {
      Alert.alert('No Session', 'Please scan your RFID card first to unlock the dashboard.');
      return;
    }
    
    const confirmMsg = `Buy ${name}?`;
    let proceed = false;

    if (Platform.OS === 'web') {
      proceed = window.confirm(confirmMsg);
    } else {
      // For mobile, Alert.alert is used. Since buyService is async, 
      // we wrap it in a Promise to wait for user interaction if needed, 
      // or just call it directly with the native callback style.
      return Alert.alert(
        'Confirm Purchase',
        confirmMsg,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => executePurchase(productId, rfidUid) }
        ]
      );
    }

    if (proceed) executePurchase(productId, rfidUid);
  };

  const executePurchase = async (productId, rfidUid) => {
    console.log(`Attempting purchase of ${productId} for ${rfidUid}`);
    try {
      const res = await axios.post(`${Config.API_BASE}/purchase`, {
        uid: rfidUid,
        productId: productId,
        terminal: 'Mobile-Dashboard'
      });
      
      if (res.data.success) {
        Alert.alert('Success', res.data.message || 'Purchase complete!');
        fetchData(); 
      } else {
        Alert.alert('Server Rejected', res.data.message || 'Unknown error');
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Network Timeout';
      Alert.alert('Error', msg);
      console.error('Purchase Call Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Check for new scans every 3 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy Services</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.category.toUpperCase()}</Text>
            </View>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price} <Text style={styles.currency}>Credits</Text></Text>
            <TouchableOpacity 
              style={styles.buyBtn}
              onPress={() => buyService(item._id, item.name)}
            >
              <ShoppingBag color="#fff" size={18} style={{ marginRight: 8 }} />
              <Text style={styles.buyBtnText}>Purchase</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
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
  productCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  badgeText: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: '700',
  },
  productName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  productPrice: {
    color: '#6366f1',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
  },
  currency: {
    fontSize: 14,
    fontWeight: '400',
    color: '#94a3b8',
  },
  buyBtn: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  buyBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
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
      setRfidUid(sessRes.data.rfid_uid);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buyService = async (productId, name) => {
    if (!rfidUid) return;
    
    Alert.alert(
      'Confirm Purchase',
      `Buy ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          onPress: async () => {
            try {
              const res = await axios.post(`${Config.API_BASE}/purchase`, {
                rfidUid: rfidUid,
                productId: productId,
                quantity: 1
              });
              if (res.data.success) {
                Alert.alert('Success', 'Purchase complete!');
              }
            } catch (error) {
              Alert.alert('Error', error.response?.data?.error || 'Purchase failed');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchData();
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

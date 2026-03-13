import React from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { Smartphone } from 'lucide-react-native';

export default function ScanLock() {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.iconCircle}>
          <Smartphone color="#6366f1" size={60} />
        </View>
      </Animated.View>
      
      <Text style={styles.title}>Terminal Locked</Text>
      <Text style={styles.text}>
        Please scan your RFID card on the hardware reader to access the mobile dashboard.
      </Text>
      
      <View style={styles.indicator}>
        <Text style={styles.indicatorText}>Waiting for MQTT Signal...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 300,
  },
  indicator: {
    marginTop: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  indicatorText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});

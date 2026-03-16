import { Platform } from 'react-native';

const API_BASE = 'http://127.0.0.1:5055/api';
// Platform.OS === 'web' 
//   ? 'http://127.0.0.1:5055/api' // For web browsers on host machine
//   : 'http://10.84.183.218:5055/api'; // Standard for Android Emulator to host machine

export default {
  API_BASE,
  SESSION_TIMEOUT: 300, 
  TEAM_ID: 'wallet', // Group ID
};

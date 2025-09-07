// firebase-messaging.js
import messaging from '@react-native-firebase/messaging';

console.log('🚀 firebase-messaging.js loaded'); // ✅ báo module được load

// Chỉ log dữ liệu khi background message đến
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('🚀 Background Message received in headless:', remoteMessage);
});

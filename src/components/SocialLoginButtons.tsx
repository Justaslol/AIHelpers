// src/components/SocialLoginButtons.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { auth } from '../firebase';
import firebase from 'firebase/app';
import { GoogleAuthProvider } from 'firebase/auth';
import { signInWithCredential } from 'firebase/auth';

const SocialLoginButtons: React.FC = () => {
  const [requestGoogle, responseGoogle, promptGoogle] = Google.useAuthRequest({
    clientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
  });


  React.useEffect(() => {
    if (responseGoogle?.type === 'success' && responseGoogle.authentication) {
      const { authentication } = responseGoogle;
      const credential = GoogleAuthProvider.credential(
        authentication.idToken,
        authentication.accessToken
      );
      signInWithCredential(auth, credential).catch((error) => {
        console.error('Google login error:', error);
      });
    }
  }, [responseGoogle]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
        onPress={() => promptGoogle()}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SocialLoginButtons;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  socialButton: {
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
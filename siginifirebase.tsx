import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function SignInMiercoles() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const rotateValue = useRef(new Animated.Value(0)).current;

  // Handle user state changes
  function handleAuthStateChanged(user: User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  // Función para el icono con loop de animación
  const startIconLoop = () => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    
    // Iniciar la animación del icono
    startIconLoop();
    
    return subscriber; // unsubscribe on unmount
  }, []);

  // Crear la rotación interpolada
  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  async function handleAppleSignIn() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      console.log('Apple Sign In successful:', credential);
      // Aquí podrías integrar con Firebase Auth si necesitas
      // Por ahora, solo mostramos la información en consola
      
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        console.log('User canceled Apple Sign In');
      } else {
        console.error('Apple Sign In error:', error);
      }
    }
  }

  if (initializing) {
    return (
      <View style={styles.container}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="refresh-circle" size={60} color="#007AFF" />
        </Animated.View>
        <Text style={styles.loadingText}>Connecting...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Animated.View style={{ transform: [{ rotate }], marginBottom: 30 }}>
          <Ionicons name="person-circle-outline" size={100} color="#007AFF" />
        </Animated.View>
        
        <Text style={styles.title}>Sign In Required</Text>
        <Text style={styles.subtitle}>Welcome to the app</Text>
        
        <TouchableOpacity 
          onPress={handleAppleSignIn}
          style={styles.appleButton}
        >
          <Ionicons name="logo-apple" size={24} color="#fff" style={{ marginRight: 12 }} />
          <Text style={styles.buttonText}>
            Sign in with Apple
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate }], marginBottom: 30 }}>
        <Ionicons name="checkmark-circle" size={100} color="#34C759" />
      </Animated.View>
      
      <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
      
      <View style={styles.userInfo}>
        <Ionicons name="mail" size={20} color="#666" style={{ marginRight: 10 }} />
        <Text style={styles.emailText}>{user.email}</Text>
      </View>
      
      <View style={styles.userInfo}>
        <Ionicons name="person" size={20} color="#666" style={{ marginRight: 10 }} />
        <Text style={styles.uidText}>ID: {user.uid.substring(0, 8)}...</Text>
      </View>
      
      <Text style={styles.successText}>
        ✨ Sesión iniciada correctamente
      </Text>
      
      <TouchableOpacity 
        onPress={() => getAuth().signOut()}
        style={styles.signOutButton}
      >
        <Ionicons name="log-out" size={20} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emailText: {
    fontSize: 16,
    color: '#333',
  },
  uidText: {
    fontSize: 14,
    color: '#666',
  },
  successText: {
    fontSize: 18,
    color: '#34C759',
    marginVertical: 20,
    textAlign: 'center',
  },
  appleButton: {
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignInMiercoles;

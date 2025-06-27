import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const rotateValue = useRef(new Animated.Value(0)).current;

  // Función para el icono con sequence de animación
  const startIconSequence = () => {
    Animated.sequence([
      // Primera animación: girar 180 grados
      Animated.timing(rotateValue, {
        toValue: 0.5,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      // Segunda animación: girar hasta 360 grados
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      // Tercera animación: volver a 0 grados
      Animated.timing(rotateValue, {
        toValue: 0,
        duration: 500,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Repetir la secuencia
      startIconSequence();
    });
  };

  useEffect(() => {
    startIconSequence();
  }, []);

  // Crear la rotación interpolada
  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const initializeFirebase = async () => {
    try {
      setLoading(true);
      
      // Importar la configuración de Firebase
      const { auth } = require('../../firebaseConfig');
      
      console.log('Firebase initialized successfully');
      
      // Por ahora, no configuramos el auth listener para evitar errores
      // setUser(null); // Usuario no autenticado inicialmente
      
      setFirebaseInitialized(true);
      setLoading(false);
      Alert.alert('Éxito', 'Firebase se inicializó correctamente. Ahora puedes usar la app.');
      
    } catch (error: any) {
      console.error('Error initializing Firebase:', error);
      setLoading(false);
      Alert.alert('Error', `Error al inicializar Firebase: ${error.message}`);
    }
  };

  async function handleAppleSignIn() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      console.log('Apple Sign In successful:', credential);
      
      // Importar Firebase para autenticación
      const { auth } = require('../../firebaseConfig');
      const { signInWithCredential, OAuthProvider } = require('firebase/auth');
      
      // Crear credencial de Firebase con Apple
      const provider = new OAuthProvider('apple.com');
      const firebaseCredential = provider.credential({
        idToken: credential.identityToken!,
      });
      
      // Iniciar sesión en Firebase
      const result = await signInWithCredential(auth, firebaseCredential);
      console.log('Firebase sign in successful:', result.user);
      
      // Actualizar el estado del usuario
      setUser(result.user);
      
      Alert.alert('Éxito', 'Inicio de sesión exitoso con Apple y Firebase');
      
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        console.log('User canceled Apple Sign In');
      } else {
        console.error('Apple Sign In error:', error);
        Alert.alert('Error', 'Error al iniciar sesión con Apple');
      }
    }
  }

  // Si Firebase no está inicializado, mostrar pantalla de inicialización
  if (!firebaseInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>¡Bienvenido a la App!</Text>
        <Text style={styles.subtitle}>Necesitamos inicializar Firebase primero</Text>
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={initializeFirebase}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Inicializando...' : 'Inicializar Firebase'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>
          Presiona el botón para comenzar a usar la app
        </Text>
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
        <Text style={styles.uidText}>ID: {user.uid}</Text>
      </View>
      
      <Text style={styles.successText}>
        ✨ Sesión iniciada correctamente
      </Text>
      
      <TouchableOpacity 
        onPress={async () => {
          try {
            const { auth } = require('../../firebaseConfig');
            const { signOut } = require('firebase/auth');
            await signOut(auth);
            setUser(null);
            Alert.alert('Cerrar sesión', 'Sesión cerrada correctamente');
          } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Error', 'Error al cerrar sesión');
          }
        }}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
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
});

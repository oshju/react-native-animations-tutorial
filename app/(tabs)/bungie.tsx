


import React, { useState } from 'react';
import { useBungieToken } from '../context/BungieTokenContext';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const BUNGIE_CLIENT_ID = '37130';
const BUNGIE_API_KEY = '37130';
const BUNGIE_REDIRECT_URI = 'com.example.ui://callback';
const AUTH_URL = `https://www.bungie.net/en/OAuth/Authorize?client_id=${BUNGIE_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(BUNGIE_REDIRECT_URI)}`;

export default function BungieAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const { accessToken, setAccessToken } = useBungieToken();
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Intercambio de code por token
  const exchangeCodeForToken = async (code: string) => {
    setIsLoading(true);
    setError(null);
    setAccessToken(null);
    setRefreshToken(null);
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('client_id', BUNGIE_CLIENT_ID);
      params.append('redirect_uri', BUNGIE_REDIRECT_URI);

      const response = await fetch('https://www.bungie.net/platform/app/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-API-Key': BUNGIE_API_KEY,
        },
        body: params.toString(),
      });
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Respuesta inválida de Bungie.');
      }
      if (!response.ok || !data.access_token) {
        throw new Error('Error al intercambiar el código: ' + (data.error_description || JSON.stringify(data)));
      }
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
    } catch (err: any) {
      setError(err.message || 'Error desconocido al intercambiar el código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBungieLogin = async () => {
    setIsLoading(true);
    setError(null);
    setAuthCode(null);
    setAccessToken(null);
    setRefreshToken(null);
    try {
      const result = await WebBrowser.openAuthSessionAsync(AUTH_URL, BUNGIE_REDIRECT_URI);
      if (result.type === 'success' && result.url) {
        const codeMatch = result.url.match(/[?&]code=([^&]+)/);
        if (codeMatch) {
          const code = codeMatch[1];
          setAuthCode(code);
          await exchangeCodeForToken(code);
        } else {
          setError('No se pudo obtener el código de autorización.');
        }
      } else if (result.type === 'cancel') {
        setError('Login cancelado por el usuario.');
      } else {
        setError('No se pudo completar el login.');
      }
    } catch (err) {
      setError('Error durante la autenticación: ' + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login con Bungie</Text>
      <Text style={styles.subtitle}>Autentícate con tu cuenta de Bungie.net</Text>
      <Pressable style={styles.button} onPress={handleBungieLogin} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Conectando...' : 'Iniciar sesión con Bungie'}</Text>
      </Pressable>
      {isLoading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}
      {authCode && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Código de autorización:</Text>
          <Text selectable style={styles.resultCode}>{authCode}</Text>
        </View>
      )}
      {accessToken && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Access Token (compartido):</Text>
          <Text selectable style={styles.resultCode}>{accessToken}</Text>
          <Text style={styles.resultTitle}>Refresh Token:</Text>
          <Text selectable style={styles.resultCode}>{refreshToken}</Text>
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.infoText}>
        El flujo ahora intercambia automáticamente el código por el access token usando la API de Bungie.net.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#191A1C',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8E16C',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultBox: {
    backgroundColor: '#23272A',
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  resultTitle: {
    color: '#F8E16C',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  resultCode: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  infoText: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 30,
    textAlign: 'center',
  },
});

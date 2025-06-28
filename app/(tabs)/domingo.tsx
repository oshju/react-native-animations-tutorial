import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SPOTIFY_CONFIG } from '../../spotify-config';

const { width, height } = Dimensions.get('window');

// Configuración de Spotify OAuth
const SPOTIFY_CLIENT_ID = SPOTIFY_CONFIG.CLIENT_ID;
const SPOTIFY_REDIRECT_URI = SPOTIFY_CONFIG.REDIRECT_URI;

const SPOTIFY_SCOPES = SPOTIFY_CONFIG.SCOPES.join(' ');

interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  spotifyLogo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  playlistsContainer: {
    width: '100%',
    maxHeight: 300,
  },
  playlistsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  playlistItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  playlistDetails: {
    fontSize: 14,
    color: '#rgba(255,255,255,0.7)',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default function Domingo() {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para iniciar el login con Spotify
  const handleSpotifyLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(SPOTIFY_SCOPES)}&show_dialog=true`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, SPOTIFY_REDIRECT_URI);

      if (result.type === 'success') {
        const url = result.url;
        const accessToken = extractAccessToken(url);
        
        if (accessToken) {
          await fetchUserProfile(accessToken);
          await fetchUserPlaylists(accessToken);
        } else {
          setError('No se pudo obtener el token de acceso');
        }
      } else if (result.type === 'cancel') {
        setError('Login cancelado por el usuario');
      }
    } catch (err) {
      setError('Error durante el login: ' + err);
    } finally {
      setIsLoading(false);
    }
  };

  // Extraer el token de acceso de la URL de respuesta
  const extractAccessToken = (url: string): string | null => {
    const match = url.match(/access_token=([^&]*)/);
    return match ? match[1] : null;
  };

  // Obtener perfil del usuario
  const fetchUserProfile = async (accessToken: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const userData: SpotifyUser = await response.json();
        setUser(userData);
      } else {
        setError('Error al obtener el perfil del usuario');
      }
    } catch (err) {
      setError('Error al obtener el perfil: ' + err);
    }
  };

  // Obtener playlists del usuario
  const fetchUserPlaylists = async (accessToken: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=10', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlaylists(data.items);
      } else {
        setError('Error al obtener las playlists');
      }
    } catch (err) {
      setError('Error al obtener playlists: ' + err);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setUser(null);
    setPlaylists([]);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1DB954', '#191414', '#1DB954']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
          {/* Logo y título */}
          <View style={styles.logoContainer}>
            <Ionicons name="musical-notes" size={120} color="#1DB954" style={styles.spotifyLogo} />
            <Text style={styles.title}>Spotify Login</Text>
            <Text style={styles.subtitle}>Conecta tu cuenta para acceder a tus playlists</Text>
          </View>

          {/* Estado de login */}
          {!user ? (
            <Pressable style={styles.loginButton} onPress={handleSpotifyLogin} disabled={isLoading}>
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Conectando...' : 'Conectar con Spotify'}
              </Text>
            </Pressable>
          ) : (
            <>
              {/* Información del usuario */}
              <View style={styles.userInfo}>
                {user.images && user.images[0] && (
                  <Image source={{ uri: user.images[0].url }} style={styles.userImage} />
                )}
                <Text style={styles.userName}>{user.display_name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>

              {/* Botón de logout */}
              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
              </Pressable>

              {/* Lista de playlists */}
              <View style={styles.playlistsContainer}>
                <Text style={styles.playlistsTitle}>Tus Playlists</Text>
                {playlists.map((playlist) => (
                  <View key={playlist.id} style={styles.playlistItem}>
                    {playlist.images && playlist.images[0] && (
                      <Image source={{ uri: playlist.images[0].url }} style={styles.playlistImage} />
                    )}
                    <View style={styles.playlistInfo}>
                      <Text style={styles.playlistName}>{playlist.name}</Text>
                      <Text style={styles.playlistDetails}>
                        {playlist.tracks.total} canciones • {playlist.owner.display_name}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Loading */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1DB954" />
              <Text style={styles.loadingText}>Conectando con Spotify...</Text>
            </View>
          )}

          {/* Error */}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
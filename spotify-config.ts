// Configuración de Spotify OAuth 2
// Para usar esta funcionalidad, necesitas:

// 1. Crear una aplicación en Spotify Developer Dashboard:
//    - Ve a https://developer.spotify.com/dashboard
//    - Inicia sesión con tu cuenta de Spotify
//    - Haz clic en "Create App"
//    - Completa la información requerida

// 2. Configurar la aplicación:
//    - En la página de tu app, ve a "Edit Settings"
//    - En "Redirect URIs", agrega: com.example.ui://
//    - Guarda los cambios

// 3. Copiar el Client ID:
//    - En la página de tu app, copia el "Client ID"
//    - Reemplaza 'TU_SPOTIFY_CLIENT_ID' en el archivo domingo.tsx

export const SPOTIFY_CONFIG = {
  CLIENT_ID: '9a5ca2dbd3d84250aacbde63de954f16', // Client ID real de Spotify
  REDIRECT_URI: 'com.example.ui://', // URI de redirección configurada
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read'
  ]
};

// Permisos solicitados:
// - user-read-private: Leer información privada del usuario
// - user-read-email: Leer email del usuario
// - playlist-read-private: Leer playlists privadas
// - playlist-read-collaborative: Leer playlists colaborativas
// - user-library-read: Leer biblioteca del usuario 
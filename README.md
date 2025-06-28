# 🎨 React Native Animations Tutorial

Este proyecto contiene una colección completa de animaciones en React Native, desde las más básicas hasta las más avanzadas. Perfecto para aprender y experimentar con la API de Animated de React Native.

## 📱 Características

- ✅ Animaciones básicas (scale, rotate, fade)
- ✅ Animaciones avanzadas (sequence, parallel, loop)
- ✅ Animación de "Now Playing" estilo Spotify
- ✅ Carousel con animaciones de scroll
- ✅ Botones interactivos con feedback visual
- ✅ Integración con enlaces externos
- ✅ **OAuth 2.0 con Spotify** (Login y gestión de playlists)

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd my-new-app

# Instalar dependencias
npm install

# Ejecutar en iOS
npx expo run:ios

# Ejecutar en Android
npx expo run:android
```

## 🔐 OAuth 2.0 con Spotify - Tutorial Completo

### 📋 Prerrequisitos

1. **Cuenta de Spotify Developer:**
   - Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Inicia sesión con tu cuenta de Spotify
   - Crea una nueva aplicación

2. **Dependencias necesarias:**
   ```bash
   npx expo install expo-auth-session expo-crypto expo-web-browser
   ```

### 🛠️ Configuración Paso a Paso

#### **1. Crear Aplicación en Spotify Dashboard**

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Haz clic en **"Create App"**
3. Completa la información:
   - **App name:** Tu nombre de aplicación
   - **App description:** Descripción de tu app
   - **Website:** URL de tu sitio web (opcional)
   - **Redirect URI:** `com.example.ui://` (importante)
4. Acepta los términos y crea la aplicación

#### **2. Configurar Redirect URI**

1. En tu aplicación, ve a **"Edit Settings"**
2. En la sección **"Redirect URIs"**, agrega:
   ```
   com.example.ui://
   ```
3. Haz clic en **"Save"**

#### **3. Obtener Client ID**

1. En la página de tu aplicación, copia el **"Client ID"**
2. Será algo como: `9a5ca2dbd3d84250aacbde63de954f16`

#### **4. Configurar el Proyecto**

**Archivo `spotify-config.ts`:**
```typescript
export const SPOTIFY_CONFIG = {
  CLIENT_ID: 'TU_CLIENT_ID_AQUI', // Reemplaza con tu Client ID real
  REDIRECT_URI: 'com.example.ui://',
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read'
  ]
};
```

**Archivo `app.json`:**
```json
{
  "expo": {
    "scheme": "com.example.ui",
    "plugins": [
      "expo-web-browser"
    ]
  }
}
```

#### **5. Regenerar Código Nativo**

```bash
npx expo prebuild --clean
```

### 💻 Implementación del Código

#### **Interfaces TypeScript**

```typescript
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
```

#### **Función de Login OAuth 2.0**

```typescript
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
```

#### **Extraer Token de Acceso**

```typescript
const extractAccessToken = (url: string): string | null => {
  const match = url.match(/access_token=([^&]*)/);
  return match ? match[1] : null;
};
```

#### **Obtener Perfil del Usuario**

```typescript
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
```

#### **Obtener Playlists del Usuario**

```typescript
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
```

### 🎨 Interfaz de Usuario

#### **Estados de la Aplicación**

```typescript
const [user, setUser] = useState<SpotifyUser | null>(null);
const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

#### **Componente de Login**

```typescript
{!user ? (
  <Pressable style={styles.loginButton} onPress={handleSpotifyLogin} disabled={isLoading}>
    <Text style={styles.loginButtonText}>
      {isLoading ? 'Conectando...' : 'Conectar con Spotify'}
    </Text>
  </Pressable>
) : (
  // Mostrar información del usuario y playlists
)}
```

### 🔑 Permisos (Scopes) de Spotify

| Scope | Descripción |
|-------|-------------|
| `user-read-private` | Leer información privada del usuario |
| `user-read-email` | Leer email del usuario |
| `playlist-read-private` | Leer playlists privadas |
| `playlist-read-collaborative` | Leer playlists colaborativas |
| `user-library-read` | Leer biblioteca del usuario |

### 🚨 Manejo de Errores

```typescript
// Estados de error
const [error, setError] = useState<string | null>(null);

// Mostrar errores en la UI
{error && <Text style={styles.errorText}>{error}</Text>}

// Manejo de errores en las funciones
try {
  // Código de la función
} catch (err) {
  setError('Error descriptivo: ' + err);
}
```

### 📱 Flujo de Autenticación

1. **Usuario presiona "Conectar con Spotify"**
2. **Se abre navegador con página de autorización de Spotify**
3. **Usuario autoriza la aplicación**
4. **Spotify redirige a la app con el token de acceso**
5. **Se extrae el token de la URL**
6. **Se hacen llamadas a la API de Spotify**
7. **Se muestra la información del usuario y playlists**

### 🔧 Solución de Problemas

#### **Error: "Invalid redirect URI"**
- Verifica que el Redirect URI en Spotify Dashboard coincida exactamente con `com.example.ui://`
- Asegúrate de que el scheme en `app.json` sea `com.example.ui`

#### **Error: "Client ID not found"**
- Verifica que el Client ID en `spotify-config.ts` sea correcto
- Asegúrate de que la aplicación esté creada en Spotify Dashboard

#### **Error: "Token extraction failed"**
- Verifica que el Redirect URI esté configurado correctamente
- Asegúrate de que el usuario haya autorizado la aplicación

### 🎯 Características Implementadas

- ✅ **Login OAuth 2.0** seguro con Spotify
- ✅ **Manejo de tokens** de acceso
- ✅ **Perfil de usuario** completo
- ✅ **Lista de playlists** del usuario
- ✅ **Manejo de errores** robusto
- ✅ **Estados de carga** y feedback visual
- ✅ **Logout** funcional
- ✅ **Interfaz moderna** con degradados

## 🎯 Animaciones Implementadas

### 1. 🫀 Animación de Corazón (Scale + Spring)

```typescript
const heartScale = useRef(new Animated.Value(1)).current;

const animateHeart = () => {
  Animated.sequence([
    Animated.timing(heartScale, {
      toValue: 1.4,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.spring(heartScale, {
      toValue: 1,
      friction: 3,
      tension: 80,
      useNativeDriver: true,
    })
  ]).start();
};
```

**Conceptos clave:**
- `Animated.sequence()`: Encadena animaciones
- `Animated.spring()`: Animación con efecto de resorte
- `useNativeDriver: true`: Mejora el rendimiento

### 2. 🐦 Animación de Twitter (Scale + Linking)

```typescript
const animateTwitter = () => {
  Animated.sequence([
    Animated.timing(twitterScale, {
      toValue: 1.4,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.spring(twitterScale, {
      toValue: 1,
      friction: 3,
      tension: 80,
      useNativeDriver: true,
    })
  ]).start(() => {
    Linking.openURL('https://twitter.com');
  });
};
```

**Conceptos clave:**
- `Linking.openURL()`: Abre enlaces externos
- Callback en `.start()`: Ejecuta código después de la animación

### 3. 🎵 Animación "Now Playing" (Audio Bars)

```typescript
const bar1Height = useRef(new Animated.Value(10)).current;
const [isPlaying, setIsPlaying] = useState(false);

const startNowPlayingAnimation = () => {
  setIsPlaying(true);
  
  const animateBar = (bar: Animated.Value) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(bar, {
          toValue: Math.random() * 30 + 5,
          duration: 300 + Math.random() * 400,
          useNativeDriver: false,
        }),
        Animated.timing(bar, {
          toValue: Math.random() * 15 + 5,
          duration: 300 + Math.random() * 400,
          useNativeDriver: false,
        })
      ])
    );
  };

  Animated.parallel([
    animateBar(bar1Height),
    animateBar(bar2Height),
    animateBar(bar3Height),
    animateBar(bar4Height),
    animateBar(bar5Height)
  ]).start();
};
```

**Conceptos clave:**
- `Animated.loop()`: Repite animación infinitamente
- `Animated.parallel()`: Ejecuta múltiples animaciones simultáneamente
- `Math.random()`: Valores aleatorios para simular audio real
- `useNativeDriver: false`: Necesario para animar `height`

### 4. 🎠 Carousel con Animaciones de Scroll

```typescript
const scrollX = useRef(new Animated.Value(0)).current;

// En el ScrollView
onScroll={Animated.event(
  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
  { useNativeDriver: true }
)}

// Para cada item del carousel
const scale = scrollX.interpolate({
  inputRange: [
    (i - 1) * (ITEM_WIDTH + ITEM_SPACING),
    i * (ITEM_WIDTH + ITEM_SPACING),
    (i + 1) * (ITEM_WIDTH + ITEM_SPACING),
  ],
  outputRange: [0.85, 1, 0.85],
  extrapolate: 'clamp',
});
```

**Conceptos clave:**
- `Animated.event()`: Conecta eventos nativos con animaciones
- `interpolate()`: Mapea valores de entrada a valores de salida
- `extrapolate: 'clamp'`: Limita los valores interpolados

## 🎨 Tipos de Animaciones

### Animaciones Básicas

| Tipo | Propiedad | Ejemplo |
|------|-----------|---------|
| **Scale** | `transform: [{ scale: value }]` | Cambiar tamaño |
| **Rotate** | `transform: [{ rotate: '45deg' }]` | Rotar elemento |
| **Translate** | `transform: [{ translateX: 100 }]` | Mover horizontalmente |
| **Opacity** | `opacity: value` | Transparencia |

### Animaciones Avanzadas

| Método | Descripción | Uso |
|--------|-------------|-----|
| `Animated.timing()` | Animación con duración específica | Movimientos suaves |
| `Animated.spring()` | Animación con efecto de resorte | Botones, feedback |
| `Animated.decay()` | Animación que se desacelera | Scroll, momentum |
| `Animated.sequence()` | Encadena múltiples animaciones | Secuencias complejas |
| `Animated.parallel()` | Ejecuta animaciones simultáneamente | Múltiples elementos |
| `Animated.loop()` | Repite animación infinitamente | Indicadores de carga |

## 🔧 Configuración de Estilos

### Estructura de Estilos

```typescript
const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  
  // Elementos animados
  animatedElement: {
    width: 100,
    height: 100,
    backgroundColor: '#2196F3',
    borderRadius: 10,
  },
  
  // Botones interactivos
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 20,
    margin: 10,
  },
});
```

### Aplicación de Animaciones

```typescript
// Combinar estilos base con animaciones
<Animated.View 
  style={[
    styles.animatedElement, 
    { transform: [{ scale: animatedValue }] }
  ]} 
/>
```

## 🎯 Mejores Prácticas

### 1. **Rendimiento**
```typescript
// ✅ Usar useNativeDriver cuando sea posible
useNativeDriver: true  // Para transform y opacity
useNativeDriver: false // Para height, width, etc.
```

### 2. **Gestión de Estado**
```typescript
// ✅ Usar useRef para valores animados
const animatedValue = useRef(new Animated.Value(0)).current;

// ✅ Usar useState para estado de UI
const [isAnimating, setIsAnimating] = useState(false);
```

### 3. **Limpieza de Animaciones**
```typescript
// ✅ Detener animaciones al desmontar
useEffect(() => {
  return () => {
    animatedValue.stopAnimation();
  };
}, []);
```

### 4. **Interpolación Eficiente**
```typescript
// ✅ Crear interpolaciones una sola vez
const spin = rotationValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg']
});
```

## 🚀 Ejemplos de Uso

### Botón con Feedback
```typescript
const ButtonWithFeedback = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start();
  };
  
  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Text>Presionar</Text>
      </Animated.View>
    </Pressable>
  );
};
```

### Indicador de Carga
```typescript
const LoadingSpinner = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Text>⏳</Text>
    </Animated.View>
  );
};
```

## 📚 Recursos Adicionales

- [Documentación oficial de Animated](https://reactnative.dev/docs/animated)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Lottie para React Native](https://github.com/lottie-react-native/lottie-react-native)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Expo Auth Session](https://docs.expo.dev/versions/latest/sdk/auth-session/)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

Creado con ❤️ para aprender animaciones en React Native y OAuth 2.0

---

**¡Disfruta creando animaciones increíbles y conectando con Spotify! 🎨✨🎵**

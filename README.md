# 🎨 React Native Animations Tutorial

Este proyecto contiene una colección completa de animaciones en React Native, desde las más básicas hasta las más avanzadas. Perfecto para aprender y experimentar con la API de Animated de React Native.

## 📱 Características

- ✅ Animaciones básicas (scale, rotate, fade)
- ✅ Animaciones avanzadas (sequence, parallel, loop)
- ✅ Animación de "Now Playing" estilo Spotify
- ✅ Carousel con animaciones de scroll
- ✅ Botones interactivos con feedback visual
- ✅ Integración con enlaces externos

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

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

Creado con ❤️ para aprender animaciones en React Native

---

**¡Disfruta creando animaciones increíbles! 🎨✨**

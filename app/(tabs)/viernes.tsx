import React, { useRef } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
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
  spotifyLogo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    margin: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 150,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  cardIcon: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },
});

// Example usage of the animated icon component
export function AnimateIcon() {
  const rotateValue = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Text style={{ fontSize: 30 }}>🎵</Text>
    </Animated.View>
  );
}

// Datos de ejemplo para las tarjetas
const cardData = [
  {
    id: 1,
    title: "Animación de Rotación",
    content: "Esta tarjeta muestra un ejemplo de animación de rotación continua con React Native Animated.",
    icon: "🔄",
    color: "#4A90E2"
  },
  {
    id: 2,
    title: "Tarjeta de Música",
    content: "Una tarjeta dedicada a la música con iconos musicales y efectos visuales atractivos.",
    icon: "🎵",
    color: "#7ED321"
  },
  {
    id: 3,
    title: "Efectos de Corazón",
    content: "Animaciones de corazón que se pueden usar para indicar 'me gusta' o favoritos.",
    icon: "❤️",
    color: "#F5A623"
  },
  {
    id: 4,
    title: "ScrollView Dinámico",
    content: "Ejemplo de un ScrollView con múltiples tarjetas que se pueden desplazar verticalmente.",
    icon: "📱",
    color: "#BD10E0"
  },
  {
    id: 5,
    title: "Diseño Responsivo",
    content: "Las tarjetas se adaptan a diferentes tamaños de pantalla y orientaciones.",
    icon: "🎨",
    color: "#B8E986"
  },
  {
    id: 6,
    title: "Sombras y Elevación",
    content: "Cada tarjeta tiene sombras y efectos de elevación para crear profundidad visual.",
    icon: "✨",
    color: "#50E3C2"
  }
];

// Componente principal
export default function Viernes() {
  // Animaciones para el efecto de like de Twitter
  const heartScale = useRef(new Animated.Value(1)).current;
  const heartOpacity = useRef(new Animated.Value(1)).current;
  const heartRotation = useRef(new Animated.Value(0)).current;
  const [isLiked, setIsLiked] = React.useState(false);

  // Función para la animación de like estilo Twitter
  const animateTwitterLike = () => {
    setIsLiked(!isLiked);
    
    // Secuencia de animaciones
    Animated.sequence([
      // Fase 1: Escala hacia abajo
      Animated.timing(heartScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      // Fase 2: Escala hacia arriba (bounce)
      Animated.timing(heartScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      // Fase 3: Volver al tamaño normal
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de rotación simultánea
    Animated.timing(heartRotation, {
      toValue: isLiked ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Efecto de pulso en la opacidad
    Animated.sequence([
      Animated.timing(heartOpacity, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Función para resetear la animación
  const resetHeartAnimation = () => {
    setIsLiked(false);
    heartScale.setValue(1);
    heartOpacity.setValue(1);
    heartRotation.setValue(0);
  };

  // Interpolación para la rotación
  const rotateInterpolation = heartRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '12deg'],
  });

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={styles.title}>Tarjetas Animadas</Text>
        <Text style={styles.subtitle}>ScrollView con Cards Interactivas</Text>
      </View>
      
      <ScrollView 
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {cardData.map((card) => (
          <TouchableOpacity 
            key={card.id} 
            style={[styles.cardContainer, { borderLeftWidth: 4, borderLeftColor: card.color }]}
          >
            <View style={styles.cardIcon}>
              <Text style={{ fontSize: 30 }}>{card.icon}</Text>
            </View>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardContent}>{card.content}</Text>
            
            {card.id === 1 && (
              <View style={{ alignItems: 'center' }}>
                <AnimateIcon />
              </View>
            )}
            
            {card.id === 3 && (
              <View style={{ alignItems: 'center' }}>
            <Animated.View 
              style={{ 
                transform: [
                  { scale: heartScale },
                  { rotate: rotateInterpolation }
                ],
                opacity: heartOpacity,
              }}
            >
              <Text style={{ 
                fontSize: 32, 
                color: isLiked ? '#e91e63' : '#666',
              }}>
                {isLiked ? '❤️' : '🤍'}
              </Text>
            </Animated.View>
            
            <Pressable 
              style={[
                styles.button, 
                { 
                  backgroundColor: isLiked ? '#e91e63' : '#007AFF',
                  marginTop: 15 
                }
              ]} 
              onPress={animateTwitterLike}
            >
              <Text style={styles.buttonText}>
                {isLiked ? '💖 Liked!' : '🤍 Like'}
              </Text>
            </Pressable>
            
            <Pressable 
              style={[styles.button, { backgroundColor: '#ff6b6b', marginTop: 10 }]} 
              onPress={resetHeartAnimation}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
          </View>
            )}
          </TouchableOpacity>
        ))}
        
        <View style={[styles.cardContainer, { backgroundColor: '#f8f9fa' }]}>
          <Text style={styles.cardTitle}>¡Fin del ScrollView!</Text>
          <Text style={styles.cardContent}>
            Has llegado al final de las tarjetas. ¡Desliza hacia arriba para volver al inicio!
          </Text>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 40 }}>🎉</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

// Métodos utilitarios
function highNumber(a: number, b: number): number {
  return a > b ? a : b;
}
function highString(a: string, b: string): string {
  return a.length > b.length ? a : b;
}
function highArray(a: number[], b: number[]): number[] {
  return a.length > b.length ? a : b;
}
function cadenatoMap(cadena: string): string {
  return cadena.split('').map((char) => char.toUpperCase()).join('');
}
function cadenatoMapdos(cadena: string): string {
  return cadena.split('').map((char) => char.toUpperCase()).join('');
}
function ospInstring(cadena: string): string {
  return [...cadena].filter((char) => char === '0').join('');
}
function ospInstringdos(cadena: string): string {
  return [...cadena].map((char) => char.charAt(0)).map((char) => parseInt(char)).join('');
}

const images = [
  require('../../assets/images/blancanieves.jpeg'),
  require('../../assets/images/react-logo.png'),
  require('../../assets/images/theacolyte.jpg'),
  require('../../assets/images/adaptive-icon.png'),
  require('../../assets/images/splash-icon.png'),
];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 180;
const ITEM_SPACING = 20;

export default function Metodos() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const twitterScale = useRef(new Animated.Value(1)).current;
  const bar1Height = useRef(new Animated.Value(10)).current;
  const bar2Height = useRef(new Animated.Value(20)).current;
  const bar3Height = useRef(new Animated.Value(15)).current;
  const bar4Height = useRef(new Animated.Value(25)).current;
  const bar5Height = useRef(new Animated.Value(12)).current;
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
    setCount((prev) => {
      const newCount = prev + 1;
      console.log(newCount);
      return newCount;
    });
  };

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

  const stopNowPlayingAnimation = () => {
    setIsPlaying(false);
    bar1Height.stopAnimation();
    bar2Height.stopAnimation();
    bar3Height.stopAnimation();
    bar4Height.stopAnimation();
    bar5Height.stopAnimation();
    
    // Resetear a valores iniciales
    bar1Height.setValue(10);
    bar2Height.setValue(20);
    bar3Height.setValue(15);
    bar4Height.setValue(25);
    bar5Height.setValue(12);
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Método</Text>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: (width - ITEM_WIDTH) / 2 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {images.map((img, i) => {
          const inputRange = [
            (i - 1) * (ITEM_WIDTH + ITEM_SPACING),
            i * (ITEM_WIDTH + ITEM_SPACING),
            (i + 1) * (ITEM_WIDTH + ITEM_SPACING),
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.carouselItem,
                { transform: [{ scale }] }
              ]}
            >
              <Image
                source={img}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
      <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: 10 }}>
        <Pressable onPress={animateHeart}>
          <Animated.Image
            source={require('../../assets/images/heart.png')}
            style={[styles.heartImage, { transform: [{ scale: heartScale }] }]}
          />
        </Pressable>
        <Pressable onPress={animateTwitter}>
          <Animated.Image
            source={require('../../assets/images/twitter.png')}
            style={[styles.heartImage, { marginLeft: 8, transform: [{ scale: twitterScale }] }]}
          />
        </Pressable>
      </View>
      <Text style={styles.counterText}>Veces pulsado: {count}</Text>
      <View style={styles.greenBox}>
        <Image
          source={require('../../assets/images/react-logo.png')}
          style={styles.boxImage}
          resizeMode="contain"
        />
        <Text style={styles.boxText}>Recuadro Verde</Text>
      </View>
      
      {/* Now Playing Animation */}
      <View style={styles.nowPlayingBox}>
        <View style={styles.nowPlayingHeader}>
          <Text style={styles.nowPlayingTitle}>Now Playing</Text>
          <Pressable 
            onPress={isPlaying ? stopNowPlayingAnimation : startNowPlayingAnimation}
            style={styles.playButton}
          >
            <Text style={styles.playButtonText}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </Pressable>
        </View>
        
        <View style={styles.audioBars}>
          <Animated.View style={[styles.audioBar, { height: bar1Height }]} />
          <Animated.View style={[styles.audioBar, { height: bar2Height }]} />
          <Animated.View style={[styles.audioBar, { height: bar3Height }]} />
          <Animated.View style={[styles.audioBar, { height: bar4Height }]} />
          <Animated.View style={[styles.audioBar, { height: bar5Height }]} />
        </View>
        
        <Text style={styles.songTitle}>Canción Ejemplo</Text>
        <Text style={styles.artistName}>Artista</Text>
      </View>
      
      <Animated.Text style={styles.animatedText}>
        Texto animado con resorte
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    margin: 16,
    textAlign: 'center',
  },
  animatedText: {
    fontSize: 24,
    color: '#673ab7',
    fontWeight: '600',
    marginTop: 20,
  },
  counterText: {
    fontSize: 18,
    color: '#e91e63',
    marginTop: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    marginTop: 24,
    maxHeight: 130,
  },
  carouselItem: {
    width: ITEM_WIDTH,
    height: 110,
    marginHorizontal: ITEM_SPACING / 2,
    borderRadius: 18,
    backgroundColor: '#222',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  heartImage: {
    width: 32,
    height: 32,
    marginLeft: 10,
    marginBottom: 10,
  },
  greenBox: {
    width: 260,
    height: 120,
    backgroundColor: '#90EE90', // Verde claro
    borderRadius: 10,
    marginTop: 20,
    padding: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boxImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  boxText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  nowPlayingBox: {
    width: 260,
    height: 140,
    backgroundColor: '#90EE90',
    borderRadius: 10,
    marginTop: 20,
    padding: 15,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nowPlayingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  nowPlayingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  playButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 16,
  },
  audioBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
    height: 40,
    marginVertical: 10,
    gap: 4,
  },
  audioBar: {
    width: 8,
    backgroundColor: '#2E7D32',
    borderRadius: 4,
    minHeight: 5,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  artistName: {
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
});

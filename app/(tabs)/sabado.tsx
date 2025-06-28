import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
        paddingTop: 20,
    },
    playerContainer: {
        width: width,
        height: height,
        borderRadius: 0,
        overflow: 'hidden',
        position: 'relative',
    },
    gradientBackground: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 30,
    },
    headerSection: {
        alignItems: 'center',
        marginTop: 60,
    },
    songTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
    },
    artistName: {
        fontSize: 18,
        color: '#rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    albumArtContainer: {
        width: width - 120,
        height: width - 120,
        borderRadius: 20,
        backgroundColor: '#rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    albumArt: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    controlsSection: {
        alignItems: 'center',
        marginBottom: 10,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 5,
    },
    progressBar: {
        width: '100%',
        height: 4,
        backgroundColor: '#rgba(255,255,255,0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 2,
        width: '35%',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
    },
    timeText: {
        color: '#rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    mainControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    controlButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    controlIcon: {
        fontSize: 24,
        color: '#fff',
    },
    playIcon: {
        fontSize: 32,
        color: '#000',
    },
    secondaryControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
    },
    secondaryButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryIcon: {
        fontSize: 20,
        color: '#fff',
    },
    heartContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    heartImage: {
        width: 30,
        height: 30,
        tintColor: '#fff',
    },
    greybox: {
        width: 260,
        height: 120,
        backgroundColor: 'rgba(144, 238, 144, 0.1)',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
    },
    boxImage: {
        width: 60,
        height: 40,
        resizeMode: 'contain',
    },
    audioBars: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 8,
        gap: 4,
    },
    audioBar: {
        width: 4,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    bar1Height: {
        height: 100,
    },
    bar2Height: {
        height: 80,
    },
    bar3Height: {
        height: 60,
    },
    bar4Height: {
        height: 40,
    },
    bar5Height: {   
        height: 20,
    },
    animateButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default function Sabado() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('1:23');
    const [totalTime, setTotalTime] = useState('3:45');
    const [isLiked, setIsLiked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const heartScale = useRef(new Animated.Value(1)).current;
    const playButtonScale = useRef(new Animated.Value(1)).current;
    const bar1Height = useRef(new Animated.Value(100)).current;
    const bar2Height = useRef(new Animated.Value(80)).current;
    const bar3Height = useRef(new Animated.Value(60)).current;
    const bar4Height = useRef(new Animated.Value(40)).current;
    const bar5Height = useRef(new Animated.Value(20)).current;

    const animateBars = () => {
        if (isAnimating) {
            // Detener animación
            setIsAnimating(false);
            bar1Height.stopAnimation();
            bar2Height.stopAnimation();
            bar3Height.stopAnimation();
            bar4Height.stopAnimation();
            bar5Height.stopAnimation();
        } else {
            // Iniciar animación en loop
            setIsAnimating(true);
            
            const animateBar = (bar: Animated.Value) => {
                return Animated.loop(
                    Animated.timing(bar, {
                        toValue: Math.round(Math.random() * 40 + 10),
                        duration: 500,
                        useNativeDriver: false,
                    })
                );
            };

            Animated.parallel([
                animateBar(bar1Height),
                animateBar(bar2Height),
                animateBar(bar3Height),
                animateBar(bar4Height),
                animateBar(bar5Height)
            ]).start();
        }
    };

    const animateHeart = () => {
        setIsLiked(!isLiked);
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

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        Animated.sequence([
            Animated.timing(playButtonScale, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(playButtonScale, {
                toValue: 1,
                useNativeDriver: true,
            })
        ]).start();
    };

    return (
        <View style={styles.container}>
            <ExpoLinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={styles.playerContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.gradientBackground}>
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <Text style={styles.songTitle}>Whatever</Text>
                        <Text style={styles.artistName}>Oasis</Text>
                    </View>

                    {/* Album Art */}
                    <View style={styles.albumArtContainer}>
                        <Image
                            source={require('../../assets/images/cover.jpg')}
                            style={styles.albumArt}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Heart Button */}
                    <View style={styles.heartContainer}>
                        <Pressable onPress={animateHeart}>
                            <Animated.Image
                                source={require('../../assets/images/heart.png')}
                                style={[
                                    styles.heartImage, 
                                    { 
                                        transform: [{ scale: heartScale }],
                                        tintColor: isLiked ? '#ff6b6b' : '#fff'
                                    }
                                ]}
                            />
                        </Pressable>
                    </View>

                    {/* Controls Section */}
                    <View style={styles.controlsSection}>
                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View style={styles.progressFill} />
                            </View>
                            <View style={styles.timeContainer}>
                                <Text style={styles.timeText}>{currentTime}</Text>
                                <Text style={styles.timeText}>{totalTime}</Text>
                            </View>
                        </View>
                        <View style={styles.greybox}>
                            <Image source={require('../../assets/images/react-logo.png')} style={styles.boxImage} />
                            <View style={styles.audioBars}>
                                <Animated.View style={[styles.audioBar, { height: bar1Height }]} />
                                <Animated.View style={[styles.audioBar, { height: bar2Height }]} />
                                <Animated.View style={[styles.audioBar, { height: bar3Height }]} />
                                <Animated.View style={[styles.audioBar, { height: bar4Height }]} />
                                <Animated.View style={[styles.audioBar, { height: bar5Height }]} />
                            </View>
                            <Pressable style={styles.animateButton} onPress={animateBars}>
                                <Text style={styles.buttonText}>
                                    {isAnimating ? 'Detener' : 'Animar Barras'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ExpoLinearGradient>
        </View>
    );
}
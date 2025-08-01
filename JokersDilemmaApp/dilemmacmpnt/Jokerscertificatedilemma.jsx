import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image, Animated, Easing, ImageBackground, Share } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import { useState, useEffect, useRef } from "react";
import { commonDilemma } from "../dilemmaconsts/jokersstyles";
import { certificateBack, shareIcon } from "../dilemmaconsts/jokersimages";
import TrackPlayer from 'react-native-track-player';

const Jokerscertificatedilemma = () => {
    const navigation = useNavigation();
    const [allLevelsCompleted, setAllLevelsCompleted] = useState(false);
    const [jokerUser, setJokerUser] = useState('');
    const [typedText, setTypedText] = useState('');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const certificateText = "This certifies that\n\n" +
                          "${jokerUser} completed all levels of the Joker's Dilemma and embraced the chaos within\n\n" +
                          "You are now officially recognized as an:\n\n" +
                          "🃏 *Agent of Chaos*\n\n" +
                          "Logic failed you. Morality betrayed you\n" +
                          "But madness… madness set you free.";
    const animationRef = useRef(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const soundSetting = await AsyncStorage.getItem('JOKER_SOUND_ENABLED');
                setSoundEnabled(soundSetting !== 'false');

                const animationSetting = await AsyncStorage.getItem('JOKER_ANIMATIONS_ENABLED');
                setAnimationsEnabled(animationSetting !== 'false');
            } catch (err) {
                console.error('Failed to load settings', err);
            }
        };

        loadSettings();
    }, []);

    useEffect(() => {
        const setupPlayer = async () => {
            if (soundEnabled) {
                await TrackPlayer.setupPlayer();
                await TrackPlayer.add({
                    id: 'typingSound',
                    url: require('../../assets/sounds/typesound.wav'),
                    title: 'Typing Sound',
                    artist: 'App',
                });
            }
        };
        setupPlayer();
        
        return () => {
            TrackPlayer.reset();
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, [soundEnabled]);

    useEffect(() => {
        const checkUserExists = async () => {
            try {
                const existingUser = await AsyncStorage.getItem('JOCKER_USER');
                setJokerUser(existingUser || 'You');
            } catch (err) {
                console.error('Failed to load user', err);
            }
        };

        checkUserExists();
    }, []);

    useEffect(() => {
        const checkCompletionStatus = async () => {
            try {
                const storedData = await AsyncStorage.getItem('JOKERS_LEVELS_STATES');
                if (storedData) {
                    const levels = JSON.parse(storedData);
                    const completed = levels.every(level => level.completed);
                    setAllLevelsCompleted(completed);
                    
                    if (completed) {
                        startTypingAnimation();
                    }
                }
                
                if (animationsEnabled) {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 1000,
                            easing: Easing.out(Easing.exp),
                            useNativeDriver: true,
                        }),
                        Animated.timing(slideAnim, {
                            toValue: 0,
                            duration: 800,
                            easing: Easing.out(Easing.back(1)),
                            useNativeDriver: true,
                        })
                    ]).start();
                } else {
                    fadeAnim.setValue(1);
                    slideAnim.setValue(0);
                }
            } catch (error) {
                console.error('Error checking completion status:', error);
            }
        };

        checkCompletionStatus();
    }, [animationsEnabled]);

    const startTypingAnimation = async () => {
        if (soundEnabled) {
            await TrackPlayer.play();
        }
        
        const text = certificateText.replace('${jokerUser}', jokerUser ? `${jokerUser} has` : 'You have');
        const duration = animationsEnabled ? 7000 : 0;
        const interval = duration / text.length;
        
        if (animationsEnabled) {
            let currentIndex = 0;
            animationRef.current = setInterval(() => {
                if (currentIndex <= text.length) {
                    setTypedText(text.substring(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(animationRef.current);
                    if (soundEnabled) {
                        TrackPlayer.pause();
                    }
                }
            }, interval);
        } else {
            setTypedText(text);
        }
    };

    const shareJockerCertificate = async () => {
        try {
            if (animationsEnabled) {
                Animated.sequence([
                    Animated.timing(buttonScale, {
                        toValue: 0.95,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(buttonScale, {
                        toValue: 1.05,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(buttonScale, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true,
                    })
                ]).start();
            }

            const shareOptions = {
                title: 'Joker\'s Certificate of Madness',
                message: `${jokerUser} has completed all levels of the Joker's Dilemma and embraced the chaos within!\n\n` +
                         `"Logic failed you. Morality betrayed you. But madness... madness set you free."\n\n` +
                         `Can you survive the Joker's tests?`,
                url: 'https://apps.apple.com/us/app/jokers-dilemma/id6749201899'
            };

            await Share.share(shareOptions);
        } catch (error) {
            console.error('Error sharing certificate:', error);
        }
    };

    return (
        <View style={{flex: 1}}>
            {allLevelsCompleted ? (
                <ImageBackground source={certificateBack} style={{ flex: 1 }}>
                    <Animated.View style={{ 
                        flex: 1, 
                        padding: 20, 
                        paddingTop: 200,
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }] 
                    }}>
                        {animationsEnabled ? (
                            <Animated.View 
                                style={[
                                    commonDilemma.redBtn, 
                                    { 
                                        top: 80, 
                                        zIndex: 12,
                                        width: 282,
                                        opacity: fadeAnim,
                                        transform: [{
                                            translateY: fadeAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [-20, 0]
                                            })
                                        }]
                                    }
                                ]}
                            >
                                <LinearGradient
                                    style={commonDilemma.grad}
                                    colors={['#991200', '#620F04']}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}}
                                >
                                    <Text style={commonDilemma.redBtnText}>
                                        Your certificate
                                    </Text>
                                </LinearGradient>
                            </Animated.View>
                        ) : (
                            <View style={[
                                commonDilemma.redBtn, 
                                { 
                                    top: 80, 
                                    zIndex: 12,
                                    width: 282
                                }
                            ]}>
                                <LinearGradient
                                    style={commonDilemma.grad}
                                    colors={['#991200', '#620F04']}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}}
                                >
                                    <Text style={commonDilemma.redBtnText}>
                                        Your certificate
                                    </Text>
                                </LinearGradient>
                            </View>
                        )}
                        
                        <Text style={[
                            commonDilemma.certificateText, 
                            {fontSize: 28, marginBottom: 20, lineHeight: 34}
                        ]}>
                            {typedText.split('\n')[0] || ''}
                        </Text>

                        <Text style={[
                            commonDilemma.certificateText, 
                            {marginBottom: 20}
                        ]}>
                            {typedText.split('\n')[2] || ''}
                        </Text>

                        <Text style={[
                            commonDilemma.certificateText, 
                            {marginBottom: 20}
                        ]}>
                            {typedText.split('\n')[4] || ''}
                        </Text>

                        <Text style={[
                            commonDilemma.certificateText, 
                            {marginBottom: 20}
                        ]}>
                            {typedText.split('\n')[6] || ''}
                        </Text>

                        <Text style={commonDilemma.certificateText}>
                            {typedText.split('\n')[8] || ''}
                        </Text>
                        <Text style={[commonDilemma.certificateText, { marginBottom: 40 }]}>
                            {typedText.split('\n')[9] || ''}
                        </Text>
                        
                        {typedText.length === certificateText.length && (
                            <Animated.View style={{ transform: [{ scale: animationsEnabled ? buttonScale : 1 }] }}>
                                <TouchableOpacity 
                                    style={[
                                        commonDilemma.redBtn, 
                                        { 
                                            width: 120,
                                            height: 45,
                                            position: 'static',
                                            alignSelf: 'flex-start'
                                        }
                                    ]}
                                    onPress={shareJockerCertificate}
                                    activeOpacity={0.7}
                                >
                                    <LinearGradient
                                        style={[commonDilemma.grad, {flexDirection: 'row'}]}
                                        colors={['#991200', '#620F04']}
                                        start={{x: 0, y: 0}}
                                        end={{x: 1, y: 0}}
                                    >
                                        <Image
                                            source={shareIcon}
                                            style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 10 }}
                                        />
                                        <Text style={commonDilemma.redBtnText}>
                                            Share
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </Animated.View>
                </ImageBackground>
            ) : (
                <Animated.View style={{
                    flex: 1, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }}>
                    <Animated.Text style={[
                        commonDilemma.title, 
                        {color: '#FFE868'},
                        { opacity: fadeAnim }
                    ]}>
                        NO CERTIFICATES YET
                    </Animated.Text>
                    <Animated.Text style={[
                        commonDilemma.desc,
                        { opacity: fadeAnim }
                    ]}>
                        You haven't completed all levels yet. Keep going to earn your Joker's Certificate of Madness!
                    </Animated.Text>
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <TouchableOpacity 
                            style={[commonDilemma.redBtn, {position: 'static', marginTop: 100}]}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                style={commonDilemma.grad}
                                colors={['#991200', '#620F04']}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 0}}
                            >
                                <Text style={commonDilemma.redBtnText}>
                                    Back to Levels
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    );
};

export default Jokerscertificatedilemma;
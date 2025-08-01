import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import { joker } from "../dilemmaconsts/jokersimages";
import { commonDilemma } from "../dilemmaconsts/jokersstyles";
import { useState, useEffect, useRef } from "react";
import TrackPlayer from 'react-native-track-player';

const Jokersplayleveldilemma = ({ level: initialLevel }) => {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [level, setLevel] = useState(initialLevel);
    const [wrongChoice, setWrongChoice] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const playerInitialized = useRef(false);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const jokerScale = useRef(new Animated.Value(0.9)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const wrongShakeAnim = useRef(new Animated.Value(0)).current;

    let isPlayerInitialized = false;

    useEffect(() => {
        const initializePlayerOnce = async () => {
            try {
                if (!isPlayerInitialized) {
                    await TrackPlayer.setupPlayer();
                    await TrackPlayer.add({
                        id: 'wrongAnswerSound',
                        url: require('../../assets/sounds/wrongsound.wav'),
                        title: 'Wrong Answer Sound',
                        artist: 'App',
                    });
                    isPlayerInitialized = true;
                }
                playerInitialized.current = true;
            } catch (error) {
                if (error.message.includes('already initialized')) {
                    isPlayerInitialized = true;
                    playerInitialized.current = true;
                } else {
                    // console.error('Player setup error:', error);
                }
            }
        };

        const loadSettings = async () => {
            try {
                const [animationSetting, soundSetting] = await Promise.all([
                    AsyncStorage.getItem('JOKER_ANIMATIONS_ENABLED'),
                    AsyncStorage.getItem('JOKER_SOUND_ENABLED')
                ]);
                
                setAnimationsEnabled(animationSetting !== 'false');
                const soundEnabled = soundSetting !== 'false';
                setSoundEnabled(soundEnabled);

                if (soundEnabled) {
                    await initializePlayerOnce();
                }
            } catch (err) {
                console.error('Failed to load settings', err);
            }
        };

        loadSettings();

        return () => {
        };

    }, []);

    const playWrongSound = async () => {
        if (!soundEnabled) return;
        
        try {
            if (!playerInitialized.current) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            await TrackPlayer.seekTo(0);
            await TrackPlayer.play();
        } catch (error) {
            console.error('Error playing sound:', error);
            if (error.message.includes('No track loaded')) {
                await initializePlayer();
                await playWrongSound();
            }
        }
    };

    useEffect(() => {
        if (animationsEnabled) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    speed: 10,
                    bounciness: 8,
                    useNativeDriver: true,
                }),
                Animated.spring(jokerScale, {
                    toValue: 1,
                    speed: 10,
                    bounciness: 8,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            fadeAnim.setValue(1);
            slideAnim.setValue(0);
            jokerScale.setValue(1);
        }
    }, [animationsEnabled]);

    const runButtonPressAnimation = () => {
        if (!animationsEnabled) return;
        
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1.05,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 80,
                useNativeDriver: true,
            })
        ]).start();
    };

    const runWrongAnswerAnimation = () => {
        if (!animationsEnabled) {
            setWrongChoice(true);
            return;
        }
        
        Animated.sequence([
            Animated.timing(wrongShakeAnim, {
                toValue: 5,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(wrongShakeAnim, {
                toValue: -5,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(wrongShakeAnim, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            })
        ]).start(() => setWrongChoice(true));
    };

    const handleJokerChoiceCheck = async (opt) => {
        runButtonPressAnimation();

        if (!opt.correct) {
            await playWrongSound();
            runWrongAnswerAnimation();
            return;
        }
        
        // Correct answer handling
        if (currentIndex < level.questions.length - 1) {
            transitionToNextQuestion();
        } else {
            setLevelCompleted(true);
            await updateLevelCompletion();
        }
    };

    const transitionToNextQuestion = () => {
        if (animationsEnabled) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -30,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                updateQuestionIndex();
            });
        } else {
            updateQuestionIndex();
        }
    };

    const updateQuestionIndex = () => {
        setCurrentIndex(currentIndex + 1);
        if (animationsEnabled) {
            slideAnim.setValue(30);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    speed: 10,
                    bounciness: 8,
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const updateLevelCompletion = async () => {
        try {
            const storedData = await AsyncStorage.getItem('JOKERS_LEVELS_STATES');
            if (storedData) {
                const levels = JSON.parse(storedData);
                const updatedLevels = levels.map(l => {
                    if (l.level === level.level) {
                        return { ...l, completed: true, current: false };
                    }
                    if (l.level === level.level + 1) {
                        return { ...l, current: true };
                    }
                    return l;
                });
                await AsyncStorage.setItem('JOKERS_LEVELS_STATES', JSON.stringify(updatedLevels));
            }
        } catch (error) {
            console.error('Error updating level completion:', error);
        }
    };

    const resetLevel = () => {
        if (animationsEnabled) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 30,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                resetLevelState();
            });
        } else {
            resetLevelState();
        }
    };

    const resetLevelState = () => {
        setWrongChoice(false);
        setCurrentIndex(0);
        if (animationsEnabled) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    speed: 10,
                    bounciness: 8,
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const handleLevelCompletion = () => {
        if (level.level === 5) {
            navigation.navigate('JokerscertificateDilemma');
        } else {
            navigation.goBack();
        }
    };

    const shakeInterpolate = wrongShakeAnim.interpolate({
        inputRange: [-5, 0, 5],
        outputRange: ['-5deg', '0deg', '5deg']
    });

    if (wrongChoice) {
        return (
            <View style={{ flex: 1, backgroundColor: '#251128' }}>
                <Animated.View 
                    style={[
                        commonDilemma.redBtn, 
                        { 
                            top: 80, 
                            zIndex: 12,
                            width: 290,
                            opacity: fadeAnim,
                            transform: [{
                                translateY: slideAnim
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
                            {level.title}
                        </Text>
                    </LinearGradient>
                </Animated.View>

                <Animated.Image
                    source={joker}
                    style={{ 
                        width: '100%', 
                        height: 620, 
                        resizeMode: 'cover',
                        opacity: fadeAnim,
                        transform: [{ scale: jokerScale }]
                    }}
                />

                <Animated.View style={[
                    commonDilemma.textContainer, 
                    { 
                        paddingBottom: 40,
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                    <Text style={[
                        commonDilemma.title,
                        { 
                            textShadowColor: '#991200',
                            textShadowOffset: { width: 0, height: 0 },
                            textShadowRadius: 10,
                            marginBottom: 30,
                            textAlign: 'center'
                        }
                    ]}>
                        WRONG CHOICE...
                    </Text>

                    <Text style={[
                        commonDilemma.desc,
                        { 
                            marginBottom: 40
                        }
                    ]}>
                        The Joker laughs. He saw right through you.
                        {"\n"}Maybe you're just not mad enough... yet.
                    </Text>

                    <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
                        <TouchableOpacity 
                            style={[
                                commonDilemma.redBtn, 
                                { 
                                    width: '80%',
                                    marginBottom: 15,
                                    position: 'static'
                                }
                            ]}
                            onPress={resetLevel}
                        >
                            <LinearGradient
                                style={commonDilemma.grad}
                                colors={['#991200', '#620F04']}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 0}}
                            >
                                <Text style={commonDilemma.redBtnText}>
                                    Try again
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }

    if (levelCompleted) {
        return (
            <View style={{ flex: 1, backgroundColor: '#251128' }}>
                <Animated.View 
                    style={[
                        commonDilemma.redBtn, 
                        { 
                            top: 80, 
                            zIndex: 12,
                            width: 290,
                            opacity: fadeAnim,
                            transform: [{
                                translateY: slideAnim
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
                            {level.title}
                        </Text>
                    </LinearGradient>
                </Animated.View>

                <Animated.Image
                    source={joker}
                    style={{ 
                        width: '100%', 
                        height: 620, 
                        resizeMode: 'cover',
                        opacity: fadeAnim,
                        transform: [{ scale: jokerScale }]
                    }}
                />

                <Animated.View style={[
                    commonDilemma.textContainer, 
                    { 
                        paddingBottom: 40,
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                    <Text style={[
                        commonDilemma.title,
                        { 
                            textShadowColor: '#7FF554',
                            textShadowOffset: { width: 0, height: 0 },
                            textShadowRadius: 10,
                            marginBottom: 30,
                            textAlign: 'center',
                            color: '#FFE868'
                        }
                    ]}>
                        YOU SURVIVED THE MADNESS
                    </Text>

                    <Text style={[
                        commonDilemma.desc,
                        { 
                            marginBottom: 40
                        }
                    ]}>
                        Level {level.level} complete — Joker's impressed... for now.
                    </Text>

                    <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
                        <TouchableOpacity 
                            style={[
                                commonDilemma.redBtn, 
                                { 
                                    width: '80%',
                                    marginBottom: 15,
                                    position: 'static'
                                }
                            ]}
                            onPress={handleLevelCompletion}
                        >
                            <LinearGradient
                                style={commonDilemma.grad}
                                colors={['#7FF554', '#299900']}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 0}}
                            >
                                <Text style={commonDilemma.redBtnText}>
                                    {level.level < 5 ? 'Next level' : 'Claim Your Certificate'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#251128' }}>
            <Animated.View 
                style={[
                    commonDilemma.redBtn, 
                    { 
                        top: 80, 
                        zIndex: 12,
                        width: 290,
                        opacity: fadeAnim,
                        transform: [{
                            translateY: slideAnim
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
                        {level.title}
                    </Text>
                </LinearGradient>
            </Animated.View>

            <Animated.Image
                source={joker}
                style={{ 
                    width: '100%', 
                    height: 620, 
                    resizeMode: 'cover',
                    opacity: fadeAnim,
                    transform: [{ scale: jokerScale }]
                }}
            />

            <Animated.View style={[
                commonDilemma.textContainer, 
                { 
                    paddingBottom: 40,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}>
                <Text style={[
                    commonDilemma.title,
                    { 
                        textShadowColor: '#991200',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 10,
                        marginBottom: 30
                    }
                ]}>
                    {level.questions[currentIndex].text}
                </Text>

                {level.questions[currentIndex].options.map((opt, i) => (
                    <Animated.View 
                        key={i}
                        style={{ 
                            transform: [
                                { scale: buttonScale },
                                { rotate: opt.correct ? '0deg' : shakeInterpolate }
                            ],
                            width: '100%'
                        }}
                    >
                        <TouchableOpacity 
                            style={[
                                commonDilemma.redBtn, 
                                { 
                                    width: '100%',
                                    marginBottom: 15,
                                    position: 'static'
                                }
                            ]}
                            onPress={() => handleJokerChoiceCheck(opt)}
                        >
                            <LinearGradient
                                style={commonDilemma.grad}
                                colors={['#991200', '#620F04']}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 0}}
                            >
                                <Text style={commonDilemma.redBtnText}>
                                    {opt.label}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </Animated.View>
        </View>
    );
};

export default Jokersplayleveldilemma;
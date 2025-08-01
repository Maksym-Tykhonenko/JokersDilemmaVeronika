import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, TextInput, Image, Alert, Animated, Easing } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import jokersintro from "../dilemmaconsts/jokersintro";
import { joker } from "../dilemmaconsts/jokersimages";
import { commonDilemma } from "../dilemmaconsts/jokersstyles";
import { useState, useEffect, useRef } from "react";

const Jokersintroducedilemma = () => {
    const navigation = useNavigation();
    const [index, setIndex] = useState(0);
    const [jokerUser, setJokerUser] = useState('');
    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const loadAnimationSetting = async () => {
            try {
                const setting = await AsyncStorage.getItem('JOKER_ANIMATIONS_ENABLED');
                setAnimationsEnabled(setting !== 'false');
            } catch (err) {
                console.error('Failed to load animation setting', err);
            }
        };
        loadAnimationSetting();
    }, []);

    useEffect(() => {
        if (animationsEnabled) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            fadeAnim.setValue(1);
            slideAnim.setValue(0);
        }
    }, [animationsEnabled]);

    useEffect(() => {
        if (animationsEnabled) {
            textAnim.setValue(0);
            Animated.spring(textAnim, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }).start();
        } else {
            textAnim.setValue(1);
        }
    }, [index, animationsEnabled]);

    useEffect(() => {
        const checkUserExists = async () => {
            try {
                const existingUser = await AsyncStorage.getItem('JOCKER_USER');
                if (existingUser && index === 3) {
                    setTimeout(() => {
                        navigation.navigate('JokerslevelsDilemma');
                    }, 1000);
                }
            } catch (err) {
                console.error('Failed to load user', err);
            }
        };

        checkUserExists();
    }, [index]);

    const handlePressIn = () => {
        if (animationsEnabled) {
            Animated.spring(buttonScale, {
                toValue: 0.95,
                useNativeDriver: true,
            }).start();
        }
    };

    const handlePressOut = () => {
        if (animationsEnabled) {
            Animated.spring(buttonScale, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleJokerStoryTelling = async () => {
        if (index < 4) {
            const existingUser = await AsyncStorage.getItem('JOCKER_USER');
            if (index === 3 && existingUser) {
                navigation.navigate('JokerslevelsDilemma');
                return;
            }
            setIndex((prev) => prev + 1);
        } else {
            saveUserAndNavigate();
        }
    };

    const saveUserAndNavigate = async () => {
        if (!jokerUser.trim()) {
            Alert.alert('Error', 'Please enter a nickname');
            return;
        }

        try {
            await AsyncStorage.setItem('JOCKER_USER', jokerUser);
            
            if (animationsEnabled) {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: -100,
                        duration: 500,
                        useNativeDriver: true,
                    })
                ]).start(() => {
                    navigation.navigate('JokerslevelsDilemma');
                });
            } else {
                navigation.navigate('JokerslevelsDilemma');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save nickname');
            console.error(error);
        }
    };

    return (
        <View style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#251128', 
            justifyContent: 'flex-start'
        }}>
            {animationsEnabled ? (
                <Animated.Image
                    source={joker}
                    style={{ 
                        width: '100%', 
                        height: 620, 
                        resizeMode: 'cover',
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }}
                />
            ) : (
                <Image
                    source={joker}
                    style={{ 
                        width: '100%', 
                        height: 620, 
                        resizeMode: 'cover'
                    }}
                />
            )}
            
            <View style={commonDilemma.textContainer}>
                {index < 4 ? (
                    <View style={{ width: '100%', flexGrow: 1 }}>
                        <Text style={[
                            commonDilemma.title,
                            { 
                                textShadowColor: '#991200',
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 10
                            }
                        ]}>
                            {jokersintro[index].title}
                        </Text>
                        {jokersintro[index].text.map((t, idx) => (
                            animationsEnabled ? (
                                <Animated.Text
                                    key={idx}
                                    style={[
                                        commonDilemma.desc,
                                        {
                                            opacity: textAnim,
                                            transform: [{
                                                translateX: textAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [idx % 2 === 0 ? -20 : 20, 0]
                                                })
                                            }]
                                        }
                                    ]}
                                >
                                    {t}
                                </Animated.Text>
                            ) : (
                                <Text key={idx} style={commonDilemma.desc}>
                                    {t}
                                </Text>
                            )
                        ))}
                    </View>
                ) : (
                    <View style={{ width: '100%', flexGrow: 1 }}>
                        <Text style={[
                            commonDilemma.title,
                            { 
                                textShadowColor: '#991200',
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 10
                            }
                        ]}>
                            Set your nickname
                        </Text>
                        {animationsEnabled ? (
                            <Animated.View
                                style={{
                                    opacity: textAnim,
                                    transform: [{
                                        scale: textAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.8, 1]
                                        })
                                    }]
                                }}
                            >
                                <TextInput
                                    style={commonDilemma.input}
                                    value={jokerUser}
                                    onChangeText={setJokerUser}
                                    placeholder="nickname"
                                    placeholderTextColor='#000'
                                    autoFocus={true}
                                />
                            </Animated.View>
                        ) : (
                            <TextInput
                                style={commonDilemma.input}
                                value={jokerUser}
                                onChangeText={setJokerUser}
                                placeholder="nickname"
                                placeholderTextColor='#000'
                                autoFocus={true}
                            />
                        )}
                    </View>
                )}

                {animationsEnabled ? (
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            style={commonDilemma.redBtn}
                            onPress={handleJokerStoryTelling}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                style={commonDilemma.grad}
                                colors={['#991200', '#620F04']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={commonDilemma.redBtnText}>
                                    {index < 4 ? 'Next' : 'Save'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <TouchableOpacity
                        style={[commonDilemma.redBtn, {bottom: 40}]}
                        onPress={handleJokerStoryTelling}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            style={commonDilemma.grad}
                            colors={['#991200', '#620F04']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={commonDilemma.redBtnText}>
                                {index < 4 ? 'Next' : 'Save'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default Jokersintroducedilemma;
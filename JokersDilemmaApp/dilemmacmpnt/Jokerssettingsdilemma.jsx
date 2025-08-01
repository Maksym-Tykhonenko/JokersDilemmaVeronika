import { useNavigation } from "@react-navigation/native";
import { View, Text, Switch, TextInput, TouchableOpacity, Image, Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import { commonDilemma } from "../dilemmaconsts/jokersstyles";
import { editUser } from "../dilemmaconsts/jokersimages";
import { useState, useEffect, useRef } from "react";

const Jokerssettingsdilemma = () => {
    const [jokerUser, setJokerUser] = useState('');
    const [newJokerUser, setNewJokerUser] = useState(jokerUser || '');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [animationsEnabled, setAnimationsEnabled] = useState(true);

    const titleFadeAnim = useRef(new Animated.Value(0)).current;
    const titleSlideAnim = useRef(new Animated.Value(30)).current;
    const settingsFadeAnim = useRef(new Animated.Value(0)).current;
    const settingsScaleAnim = useRef(new Animated.Value(0.8)).current;
    const profileFadeAnim = useRef(new Animated.Value(0)).current;
    const profileSlideAnim = useRef(new Animated.Value(-30)).current;
    const inputScaleAnim = useRef(new Animated.Value(0.9)).current;
    const buttonPulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const existingUser = await AsyncStorage.getItem('JOKER_USER');
                if (existingUser) {
                    setJokerUser(existingUser);
                    setNewJokerUser(existingUser);
                }

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
        if (animationsEnabled) {
            Animated.parallel([
                Animated.timing(titleFadeAnim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.out(Easing.exp),
                    useNativeDriver: true,
                }),
                Animated.spring(titleSlideAnim, {
                    toValue: 0,
                    speed: 10,
                    bounciness: 8,
                    useNativeDriver: true,
                })
            ]).start();

            Animated.sequence([
                Animated.delay(200),
                Animated.parallel([
                    Animated.timing(settingsFadeAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.spring(settingsScaleAnim, {
                        toValue: 1,
                        friction: 4,
                        useNativeDriver: true,
                    })
                ])
            ]).start();

            Animated.sequence([
                Animated.delay(400),
                Animated.parallel([
                    Animated.timing(profileFadeAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.spring(profileSlideAnim, {
                        toValue: 0,
                        speed: 10,
                        bounciness: 8,
                        useNativeDriver: true,
                    })
                ])
            ]).start();

            Animated.sequence([
                Animated.delay(600),
                Animated.spring(inputScaleAnim, {
                    toValue: 1,
                    friction: 4,
                    useNativeDriver: true,
                })
            ]).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(buttonPulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(buttonPulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            titleFadeAnim.setValue(1);
            titleSlideAnim.setValue(0);
            settingsFadeAnim.setValue(1);
            settingsScaleAnim.setValue(1);
            profileFadeAnim.setValue(1);
            profileSlideAnim.setValue(0);
            inputScaleAnim.setValue(1);
            buttonPulseAnim.setValue(1);
        }
    }, [animationsEnabled]);

    const updateJokerUser = async () => {
        if (!newJokerUser.trim() || jokerUser === newJokerUser) return;
        
        try {
            await AsyncStorage.setItem('JOKER_USER', newJokerUser);
            setJokerUser(newJokerUser);
            
            if (animationsEnabled) {
                Animated.sequence([
                    Animated.timing(buttonPulseAnim, {
                        toValue: 1.2,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.spring(buttonPulseAnim, {
                        toValue: 1,
                        friction: 4,
                        useNativeDriver: true,
                    })
                ]).start();
            }
            
            alert('Username updated successfully!');
        } catch (err) {
            console.error('Failed to save username', err);
            
            if (animationsEnabled) {
                const shakeAnim = new Animated.Value(0);
                Animated.sequence([
                    Animated.timing(shakeAnim, {
                        toValue: 5,
                        duration: 50,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnim, {
                        toValue: -5,
                        duration: 50,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnim, {
                        toValue: 0,
                        duration: 50,
                        useNativeDriver: true,
                    })
                ]).start();
            }
            
            alert('Failed to update username');
        }
    };

    const toggleSound = async (value) => {
        try {
            await AsyncStorage.setItem('JOKER_SOUND_ENABLED', value.toString());
            setSoundEnabled(value);
            
            if (animationsEnabled) {
                Animated.spring(settingsScaleAnim, {
                    toValue: 1.05,
                    friction: 3,
                    tension: 40,
                    useNativeDriver: true,
                }).start(() => {
                    Animated.spring(settingsScaleAnim, {
                        toValue: 1,
                        friction: 3,
                        useNativeDriver: true,
                    }).start();
                });
            }
        } catch (err) {
            console.error('Failed to save sound setting', err);
        }
    };

    const toggleAnimations = async (value) => {
        try {
            await AsyncStorage.setItem('JOKER_ANIMATIONS_ENABLED', value.toString());
            setAnimationsEnabled(value);
        } catch (err) {
            console.error('Failed to save animation setting', err);
        }
    };

    return (
        <View style={{flex: 1, alignItems: 'center', paddingTop: 80}}>

            <Animated.View 
                style={[
                    commonDilemma.redBtn, 
                    { 
                        top: 80, 
                        zIndex: 12,
                        width: 282,
                        marginBottom: 30,
                        position: 'static',
                        opacity: titleFadeAnim,
                        transform: [{ translateY: titleSlideAnim }]
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
                        Settings
                    </Text>
                </LinearGradient>
            </Animated.View>

            <Animated.View 
                style={{
                    width: 282, 
                    backgroundColor: '#fff', 
                    borderRadius: 10, 
                    padding: 10, 
                    marginBottom: 50,
                    opacity: settingsFadeAnim,
                    transform: [{ scale: settingsScaleAnim }]
                }}
            >
                <View style={[commonDilemma.row, {marginBottom: 10}]}>
                    <Text style={commonDilemma.settingsText}>Sound effects</Text>
                    <Switch 
                        value={soundEnabled}
                        onValueChange={toggleSound}
                        trackColor={{ false: "#767577", true: "#991200" }}
                        thumbColor={soundEnabled ? "#f4f3f4" : "#f4f3f4"}
                    />
                </View>
                <View style={[commonDilemma.row, {marginBottom: 10}]}>
                    <Text style={commonDilemma.settingsText}>Animations</Text>
                    <Switch 
                        value={animationsEnabled}
                        onValueChange={toggleAnimations}
                        trackColor={{ false: "#767577", true: "#991200" }}
                        thumbColor={animationsEnabled ? "#f4f3f4" : "#f4f3f4"}
                    />
                </View>
            </Animated.View>

            <Animated.View 
                style={[
                    commonDilemma.redBtn, 
                    { 
                        top: 80, 
                        zIndex: 12,
                        width: 282,
                        marginBottom: 30,
                        position: 'static',
                        opacity: profileFadeAnim,
                        transform: [{ translateX: profileSlideAnim }]
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
                        Profile customize
                    </Text>
                </LinearGradient>
            </Animated.View>

            <Animated.View 
                style={[
                    commonDilemma.row, 
                    { 
                        width: 282,
                        transform: [{ scale: inputScaleAnim }]
                    }
                ]}
            >
                <TextInput
                    style={[commonDilemma.input, {marginTop: 0, width: '73%'}]}
                    value={newJokerUser}
                    onChangeText={setNewJokerUser}
                    placeholder="Enter nickname"
                    placeholderTextColor='#000'
                    autoFocus={true}
                />
                <TouchableOpacity
                    onPress={updateJokerUser}
                    disabled={jokerUser === newJokerUser || !newJokerUser.trim()}
                >
                    <Animated.Image 
                        source={editUser} 
                        style={{
                            width: 56, 
                            height: 56, 
                            resizeMode: 'contain',
                            opacity: (jokerUser === newJokerUser || !newJokerUser.trim()) ? 0.5 : 1,
                            transform: [{ scale: buttonPulseAnim }]
                        }} 
                    />
                </TouchableOpacity>
            </Animated.View>

        </View>
    )
};

export default Jokerssettingsdilemma;
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import jokerslevelsplay from "../dilemmaconsts/jokerslevelsplay";
import { commonDilemma } from "../dilemmaconsts/jokersstyles";
import Svg, { Polygon, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText, ClipPath } from 'react-native-svg';
import jokersfonts from "../dilemmaconsts/jokersfonts";
import { useState, useRef, useCallback } from "react";

const Jokerslevelsdilemma = () => {
    const navigation = useNavigation();
    const [levelsData, setLevelsData] = useState([]);
    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonAnimations = useRef(levelsData.map(() => new Animated.Value(0))).current;

    useFocusEffect(
        useCallback(() => {
            const loadSettings = async () => {
                try {
                    const animationSetting = await AsyncStorage.getItem('JOKER_ANIMATIONS_ENABLED');
                    setAnimationsEnabled(animationSetting !== 'false');
                } catch (err) {
                    console.error('Failed to load animation setting', err);
                }
            };

            const initializeLevels = async () => {
                try {
                    const storedData = await AsyncStorage.getItem('JOKERS_LEVELS_STATES');
                    
                    if (storedData) {
                        const parsedData = JSON.parse(storedData);
                        setLevelsData(parsedData);
                        buttonAnimations.current = parsedData.map(() => new Animated.Value(0));
                    } else {
                        const defaultLevels = jokerslevelsplay.map((level, index) => ({
                            ...level,
                            completed: false,
                            current: index === 0
                        }));
                        
                        await AsyncStorage.setItem('JOKERS_LEVELS_STATES', JSON.stringify(defaultLevels));
                        setLevelsData(defaultLevels);
                        buttonAnimations.current = defaultLevels.map(() => new Animated.Value(0));
                    }

                    if (animationsEnabled) {
                        fadeAnim.setValue(0);
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 800,
                            easing: Easing.out(Easing.exp),
                            useNativeDriver: true,
                        }).start();

                        const animations = buttonAnimations.current.map((anim, index) => {
                            return Animated.timing(anim, {
                                toValue: 1,
                                duration: 400,
                                delay: index * 100,
                                easing: Easing.out(Easing.quad),
                                useNativeDriver: true,
                            });
                        });

                        Animated.stagger(100, animations).start();
                    } else {
                        fadeAnim.setValue(1);
                        buttonAnimations.current.forEach(anim => anim.setValue(1));
                    }
                } catch (error) {
                    console.error('Error initializing levels:', error);
                }
            };

            loadSettings();
            initializeLevels();
        }, [animationsEnabled])
    );
    
    const getGradientColors = (level) => {
        if (level.current) return ['#991200', '#620F04'];
        if (level.completed) return ['#7FF554', '#299900'];
        return ['#4B283B', '#1D0821'];
    };

    if (levelsData.length === 0) {
        return null;
    }

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            {animationsEnabled ? (
                <Animated.View 
                    style={[
                        commonDilemma.redBtn, 
                        { 
                            top: 80, 
                            zIndex: 12,
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
                            Levels
                        </Text>
                    </LinearGradient>
                </Animated.View>
            ) : (
                <View style={[
                    commonDilemma.redBtn, 
                    { 
                        top: 80, 
                        zIndex: 12
                    }
                ]}>
                    <LinearGradient
                        style={commonDilemma.grad}
                        colors={['#991200', '#620F04']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                    >
                        <Text style={commonDilemma.redBtnText}>
                            Levels
                        </Text>
                    </LinearGradient>
                </View>
            )}
            
            <ScrollView
                style={{ width: '100%', paddingTop: 170 }}
                contentContainerStyle={{ alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
            >
                {levelsData.map((level, idx) => (
                    animationsEnabled ? (
                        <Animated.View 
                            key={idx} 
                            style={{
                                alignItems: 'center',
                                opacity: buttonAnimations.current[idx] || 0,
                                transform: [{
                                    translateY: buttonAnimations.current[idx]?.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0]
                                    }) || 0
                                }]
                            }}
                        >
                            <TouchableOpacity
                                style={{width: 100, height: 100}}
                                onPress={() => navigation.navigate('JokersplaylevelDilemma', { level })}
                                disabled={idx > 0 && !level.completed && !level.current}
                            >
                                <Svg height="100" width="100" viewBox="0 0 100 100">
                                    <Defs>
                                        <ClipPath id="clip">
                                            <Polygon points="50,5 90,30 90,70 50,95 10,70 10,30"/>
                                        </ClipPath>
                                        <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                                            <Stop offset="0" stopColor={getGradientColors(level)[0]} />
                                            <Stop offset="1" stopColor={getGradientColors(level)[1]} />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <Polygon
                                        points="50,5 90,30 90,70 50,95 10,70 10,30"
                                        fill="url(#grad)"
                                        stroke="#9F6F06"
                                        strokeWidth="4"
                                        clipPath="url(#clip)"
                                    />
                                    <SvgText 
                                        x="50" 
                                        y="60" 
                                        textAnchor="middle" 
                                        fill="#FFE868"
                                        fontSize="32"
                                        fontWeight="900"
                                        fontFamily={jokersfonts.PoppinsVariable}
                                    >
                                        {level.level}
                                    </SvgText>
                                </Svg>
                            </TouchableOpacity>
                            
                            {level.level < 5 && (
                                <Animated.View 
                                    style={[
                                        commonDilemma.levelLine,
                                        {
                                            opacity: buttonAnimations.current[idx] || 0
                                        }
                                    ]} 
                                />
                            )}
                        </Animated.View>
                    ) : (
                        <View key={idx} style={{ alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{width: 100, height: 100}}
                                onPress={() => navigation.navigate('JokersplaylevelDilemma', { level })}
                                disabled={idx > 0 && !level.completed && !level.current}
                            >
                                <Svg height="100" width="100" viewBox="0 0 100 100">
                                    <Defs>
                                        <ClipPath id="clip">
                                            <Polygon points="50,5 90,30 90,70 50,95 10,70 10,30"/>
                                        </ClipPath>
                                        <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                                            <Stop offset="0" stopColor={getGradientColors(level)[0]} />
                                            <Stop offset="1" stopColor={getGradientColors(level)[1]} />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <Polygon
                                        points="50,5 90,30 90,70 50,95 10,70 10,30"
                                        fill="url(#grad)"
                                        stroke="#9F6F06"
                                        strokeWidth="4"
                                        clipPath="url(#clip)"
                                    />
                                    <SvgText 
                                        x="50" 
                                        y="60" 
                                        textAnchor="middle" 
                                        fill="#FFE868"
                                        fontSize="32"
                                        fontWeight="900"
                                        fontFamily={jokersfonts.PoppinsVariable}
                                    >
                                        {level.level}
                                    </SvgText>
                                </Svg>
                            </TouchableOpacity>
                            
                            {level.level < 5 && (
                                <View style={commonDilemma.levelLine} />
                            )}
                        </View>
                    )
                ))}
                
                <View style={{height: 200}} />
            </ScrollView>
        </View>
    );
};

export default Jokerslevelsdilemma;
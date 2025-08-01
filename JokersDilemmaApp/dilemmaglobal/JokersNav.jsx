import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Image, Animated, Easing } from "react-native";
import jokersnavdilemma from "../dilemmaconsts/jokersnavdilemma";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { commonDilemma } from "../dilemmaconsts/jokersstyles";

const JokersNav = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [focusedDilemma, setFocusedDilemma] = useState('JokerslevelsDilemma');
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const handleNavigation = (routeName) => {
        setFocusedDilemma(routeName);
        
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 100,
                easing: Easing.ease,
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 200,
                easing: Easing.elastic(1),
                useNativeDriver: true
            })
        ]).start(() => {
            navigation.navigate(routeName);
        });
    };

    useEffect(() => {
        Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true
        }).start();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', () => {
            const state = navigation.getState();
            if (state && state.routes.length > 0) {
                const currentRoute = state.routes[state.index].name;
                if (jokersnavdilemma.some(item => item.dilemma === currentRoute)) {
                    setFocusedDilemma(currentRoute);
                }
            }
        });

        const state = navigation.getState();
        if (state && state.routes.length > 0) {
            const currentRoute = state.routes[state.index].name;
            if (jokersnavdilemma.some(item => item.dilemma === currentRoute)) {
                setFocusedDilemma(currentRoute);
            }
        }

        return unsubscribe;
    }, [navigation]);
    
    return (
        <Animated.View
            style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: opacityAnim,
                transform: [{ scale: opacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1]
                })}]
            }}
        >
            {jokersnavdilemma.map((jd, idx) => {
                const isActive = focusedDilemma === jd.dilemma;
                return (
                    <Animated.View 
                        key={idx}
                        style={{
                            transform: [{ scale: isActive ? scaleAnim : 1 }]
                        }}
                    >
                        <TouchableOpacity
                            style={[
                                commonDilemma.redBtn, 
                                { 
                                    width: 58, 
                                    height: 58, 
                                    borderRadius: 22, 
                                    position: 'static',
                                    shadowColor: isActive ? '#FFE868' : 'transparent',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: isActive ? 0.8 : 0,
                                    shadowRadius: isActive ? 10 : 0,
                                    elevation: isActive ? 10 : 0
                                }
                            ]}
                            onPress={() => handleNavigation(jd.dilemma)}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                style={[
                                    commonDilemma.grad,
                                    { borderRadius: 22 }
                                ]}
                                colors={isActive ? ['#FFE868', '#FFA500'] : ['#991200', '#620F04']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Image
                                    source={jd.image}
                                    style={{
                                        width: 28,
                                        height: 28,
                                        resizeMode: 'contain',
                                        tintColor: isActive ? '#620F04' : '#FFE868'
                                    }}
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}
        </Animated.View>
    );
};

export default JokersNav;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, ImageBackground, Animated, Easing, Image } from "react-native";
import WebView from "react-native-webview";
import { jokersback, jokersdilemma } from "../dilemmaconsts/jokersimages";
import jokersanim from '../dilemmaconsts/jokersanim';

const Jokerswelcomedilemma = () => {
    const navigation = useNavigation();
    const [showWebView, setShowWebView] = useState(true);
    const [showJoker, setShowJoker] = useState(false);
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWebView(false);
            setShowJoker(true);
            
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.elastic(1),
                useNativeDriver: true,
            }).start();
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {showWebView && (
                <WebView
                    originWhitelist={['*']}
                    source={{ html: jokersanim }}
                    style={{ 
                        flex: 1,
                        backgroundColor: 'transparent'
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
            )}
            
            {showJoker && (
                <Animated.View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ scale: scaleAnim }]
                }}>
                    <Image
                        source={jokersdilemma}
                        style={{
                            width: '100%',
                            height: 377,
                            resizeMode: 'contain'
                        }}
                    />
                </Animated.View>
            )}
        </View>
    );
};

export default Jokerswelcomedilemma;
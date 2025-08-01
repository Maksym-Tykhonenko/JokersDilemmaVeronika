import React, { ReactNode } from 'react';
import { ImageBackground, View, StyleProp, ViewStyle } from 'react-native';
import { jokersback } from '../dilemmaconsts/jokersimages';
import JokersNav from './JokersNav';

interface GlobalJokerProps {
    dilemma: ReactNode;
    nav?: boolean;
}

const GlobalJoker: React.FC<GlobalJokerProps> = ({ dilemma, nav = false }) => {
    return (
        <ImageBackground source={jokersback} style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={{ width: '100%', height: '100%' }}>
                    {dilemma}
                </View>

                {nav && (
                    <View style={navContainerStyle}>
                        <JokersNav />
                    </View>
                )}
            </View>
        </ImageBackground>
    );
};

const navContainerStyle: StyleProp<ViewStyle> = {
    width: 208,
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
};

export default GlobalJoker;
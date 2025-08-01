import { StyleSheet, Dimensions } from "react-native";
import jokersfonts from "./jokersfonts";

const { height } = Dimensions.get('window');

export const commonDilemma = StyleSheet.create({

    textContainer: {
        width: '101%',
        height: 350,
        backgroundColor: '#251128',
        borderTopRightRadius: 46,
        borderTopLeftRadius: 46,
        borderTopColor: '#FFE868',
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderRightColor: '#FFE868',
        borderLeftColor: '#FFE868',
        borderTopWidth: 2,
        padding: 30,
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center'
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#9F6F06',
        fontFamily: jokersfonts.MontaguSlabVariable,
        marginBottom: 18,
        textAlign: 'center',
        textShadowColor: '#991200',
        textShadowOffset: { width: -2, height: -2 },
        textShadowRadius: 0,
        includeFontPadding: false,
    },

    desc: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '400',
        color: '#fff',
        fontFamily: jokersfonts.MontaguSlabVariable,
        textAlign: 'center'
    },

    redBtn: {
        width: 282,
        height: 58,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#9F6F06',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        overflow: 'hidden'
    },

    grad: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    redBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFE868',
        fontFamily: jokersfonts.MontaguSlabVariable,
    },

    input: {
        width: 282,
        alignSelf: 'center',
        borderRadius: 12,
        backgroundColor: '#fff',
        paddingVertical: 17,
        paddingHorizontal: 13,
        color: '#000',
        fontSize: 17,
        lineHeight: 22,
        fontWeight: '400',
        fontFamily: jokersfonts.MontserratVariable,
        marginTop: 20
    },

    levelButton: {
        width: 80,
        height: 80,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#9F6F06',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },

    levelText: {
        fontSize: 32,
        lineHeight: 36,
        fontWeight: '800',
        color: '#FFE868',
        fontFamily: jokersfonts.PoppinsVariable,
    },

    levelLine: {
        height: 40,
        width: 4,
        backgroundColor: '#fff'
    },

    certificateText: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
        color: '#000',
        fontFamily: jokersfonts.HandleeRegular,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },

    settingsText: {
        fontSize: 17,
        lineHeight: 22,
        fontWeight: '400',
        color: '#000',
        fontFamily: jokersfonts.MontserratVariable,
    }

});
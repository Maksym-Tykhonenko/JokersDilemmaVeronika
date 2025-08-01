import { Platform } from 'react-native';

const jokersfonts = {
    HandleeRegular: Platform.select({
        ios: 'Handlee Regular',
        android: 'Handlee-Regular',
    }),

    MontaguSlabBold: Platform.select({
        ios: 'Montagu Slab 24pt Bold',
        android: 'MontaguSlab_24pt-Bold',
    }),

    MontaguSlabVariable: Platform.select({
        ios: 'Montagu Slab',
        android: 'MontaguSlab-VariableFont_opsz,wght',
    }),

    MontserratVariable: Platform.select({
        ios: 'Montserrat',
        android: 'Montserrat-VariableFont_wght',
    }),

    PoppinsVariable: Platform.select({
        ios: 'Poppins Regular',
        android: 'Poppins-Regular',
    }),
};

export default jokersfonts;
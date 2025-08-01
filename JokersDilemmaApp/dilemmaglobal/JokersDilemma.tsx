import GlobalJoker from "./GlobalJoker";

import Jokerswelcomedilemma from "../dilemmacmpnt/Jokerswelcomedilemma";
import Jokersintroducedilemma from "../dilemmacmpnt/Jokersintroducedilemma";
import Jokerslevelsdilemma from "../dilemmacmpnt/Jokerslevelsdilemma";
import Jokerscertificatedilemma from "../dilemmacmpnt/Jokerscertificatedilemma";
import Jokersplayleveldilemma from "../dilemmacmpnt/Jokersplayleveldilemma";
import Jokerssettingsdilemma from "../dilemmacmpnt/Jokerssettingsdilemma";

export const JokerswelcomeDilemma: React.FC = () => {
    return (
        <GlobalJoker
            dilemma={<Jokerswelcomedilemma />}
        />
    );
};

export const JokersintroduceDilemma: React.FC = () => {
    return (
        <GlobalJoker
            dilemma={<Jokersintroducedilemma />}
        />
    );
};

export const JokerslevelsDilemma: React.FC = () => {
    return (
        <GlobalJoker
            dilemma={<Jokerslevelsdilemma />}
            nav={true}
        />
    );
};

import React from 'react';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
    JokersplaylevelDilemma: { level: number };
};

type Props = {
    route: RouteProp<RootStackParamList, 'JokersplaylevelDilemma'>;
};

export const JokersplaylevelDilemma: React.FC<Props> = ({ route }) => {
    const { level } = route.params;

    return (
        <GlobalJoker
            dilemma={<Jokersplayleveldilemma level={level} />}
        />
    );
};

export const JokerscertificateDilemma: React.FC = () => {
    return (
        <GlobalJoker
            dilemma={<Jokerscertificatedilemma />}
            nav={true}
        />
    );
};

export const JokerssettingsDilemma: React.FC = () => {
    return (
        <GlobalJoker
            dilemma={<Jokerssettingsdilemma />}
            nav={true}
        />
    );
};
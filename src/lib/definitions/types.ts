import type { z } from 'zod';
import type { userSchema, sessionSchema, characterSchema, questionSchema } from './zod';

export type UserData = z.infer<typeof userSchema>

export type SessionData = z.infer<typeof sessionSchema>

export type CharacterData = z.infer<typeof characterSchema>

export type QuestionSchema = z.infer<typeof questionSchema>


//SUBWAY TYPES


export type Train = {
    currentStation: Station;
    nextArrivalTurn: number;
    line: TrainLine;//idk if its weird to have them point at each other
    id: string;
    isAtStation: boolean;
}

export type TrainLine = {
    id: string;
    name: string;
    trains: Train[];
    line: Station["id"][];
}

export type Station = {
    id: string,
    name: string,
    complexId: string;
    lines: TrainLine['id'][];
    borough?: "Queens" | "Brooklyn" | "Manhattan" | "Staten Island" | "Bronx";
    coordinates: { x: number; y: number };
}

export type GameState = {
    turnNumber: number;
    currentStation: Station;
    currentTrain: Train | null;
    reputation: number;
    playerMode: 'station' | 'train'
    destinationStation: Station;
    trains: Train[]
}

export type GameManager = {
    game: GameState | null;
    makeMove: (next: Station) => void;
    exitTrain: (train: Train) => void;
    boardTrain: (train: Train) => void;
    advanceTurn: () => void;
    characterTrigger: number; //hacky and bs i hate this
}

export type StationComplex = {
    id: string;
    stationIds: readonly Station['id'][];
};
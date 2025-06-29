import { createContext, useContext, useState } from "react";

interface GodModeState {
    showStationNames: boolean;
    toggleStationNames: () => void;
    editingPaths: boolean;
    toggleEditingPaths: () => void;
    showCharacterScreen: boolean;
    toggleCharacterScreen: () => void;
}

const GodModeContext = createContext<GodModeState | undefined>(undefined);

export function GodModeProvider({ children }: { children: React.ReactNode }) {
    const [showStationNames, setShowStationNames] = useState(false);
    const [editingPaths, setEditingPaths] = useState(false);
    const [showCharacterScreen, setShowCharacterScreen] = useState(true);

    const toggleStationNames = () => setShowStationNames((prev) => !prev);
    const toggleEditingPaths = () => setEditingPaths((prev) => !prev);
    const toggleCharacterScreen = () => setShowCharacterScreen((prev) => !prev);

    return (
        <GodModeContext.Provider value={{ showStationNames, toggleStationNames, editingPaths, toggleEditingPaths, showCharacterScreen, toggleCharacterScreen }}>
            {children}
        </GodModeContext.Provider>
    );
}

export function useGodMode() {
    const ctx = useContext(GodModeContext);
    if (!ctx) {
        throw new Error("useGodMode must be used within a GodModeProvider");
    }
    return ctx;
} 
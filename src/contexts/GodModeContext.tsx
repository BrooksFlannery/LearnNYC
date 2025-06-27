import { createContext, useContext, useState } from "react";

interface GodModeState {
    showStationNames: boolean;
    toggleStationNames: () => void;
}

const GodModeContext = createContext<GodModeState | undefined>(undefined);

export function GodModeProvider({ children }: { children: React.ReactNode }) {
    const [showStationNames, setShowStationNames] = useState(false);

    const toggleStationNames = () => setShowStationNames((prev) => !prev);

    return (
        <GodModeContext.Provider value={{ showStationNames, toggleStationNames }}>
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
import type { PathMap } from "~/components/PathEditor";

const STORAGE_KEY = "train-paths-v1";

export function loadPathMap(): PathMap | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as PathMap) : null;
    } catch {
        return null;
    }
} 
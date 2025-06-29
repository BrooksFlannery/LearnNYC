import { useEffect, useMemo, useRef, useState } from "react";
import { REAL_STATIONS } from "~/domain/data/stations";
import { allLines } from "~/domain/data/lines";
import { useGodMode } from "~/contexts/GodModeContext";

// ---- Types ---------------------------------------------------------------

export type PathPoint = { x: number; y: number };
export interface PathSegment {
    id: string; // `${fromId}->${toId}` (directionless ID – from<id>_<toId> sorted)
    fromId: string;
    toId: string;
    points: PathPoint[]; // includes both stations & control points (ordered)
}
export type PathMap = Record<string, PathSegment>;

// ---- Helpers -------------------------------------------------------------

function midpoint(a: PathPoint, b: PathPoint): PathPoint {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function buildInitialPathMap(): PathMap {
    const stationMap = new Map(REAL_STATIONS.map((s) => [s.id, s]));
    const segments: PathMap = {};
    const addSegment = (fromId: string, toId: string) => {
        const sortedId = [fromId, toId].sort().join("->"); // direction-less id
        if (segments[sortedId]) return;
        const fromSt = stationMap.get(fromId);
        const toSt = stationMap.get(toId);
        if (!fromSt || !toSt) return;
        segments[sortedId] = {
            id: sortedId,
            fromId,
            toId,
            points: [
                { x: fromSt.coordinates.x, y: fromSt.coordinates.y },
                midpoint(fromSt.coordinates, toSt.coordinates),
                { x: toSt.coordinates.x, y: toSt.coordinates.y },
            ],
        };
    };

    allLines.forEach((line) => {
        const ids = line.line;
        for (let i = 0; i < ids.length - 1; i++) {
            addSegment(ids[i]!, ids[i + 1]!);
        }
    });
    return segments;
}

// Simple debounce implementation (executes fn after wait ms since last call)
function debounce<F extends (...args: any[]) => void>(fn: F, wait: number) {
    let t: NodeJS.Timeout | undefined;
    return (...args: Parameters<F>) => {
        if (t) clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
}

const STORAGE_KEY = "train-paths-v1";

// ---- Component -----------------------------------------------------------

export default function PathEditor() {
    const { editingPaths } = useGodMode();
    const svgRef = useRef<SVGSVGElement | null>(null);
    const groupRef = useRef<SVGGElement | null>(null);

    // Build / load path data
    const [paths, setPaths] = useState<PathMap>(() => {
        if (typeof window === "undefined") return {};
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved) as PathMap;
        } catch { }
        return buildInitialPathMap();
    });

    // Auto-save (debounced)
    const saveDebounced = useMemo(
        () =>
            debounce((p: PathMap) => {
                try {
                    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
                } catch { }
            }, 500),
        []
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            saveDebounced(paths);
        }
    }, [paths, saveDebounced]);

    // Drag state
    const dragInfo = useRef<{ segId: string; idx: number } | null>(null);

    // Helper to convert mouse event to SVG coord (accounting for transform)
    const eventPoint = (evt: React.PointerEvent) => {
        const svg = svgRef.current;
        const g = groupRef.current;
        if (!svg || !g) return { x: 0, y: 0 };
        const pt = svg.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        const ctm = g.getScreenCTM();
        if (ctm) {
            const inv = ctm.inverse();
            const local = pt.matrixTransform(inv);
            return { x: local.x, y: local.y };
        }
        return { x: 0, y: 0 };
    };

    // Pointer event handlers
    const handlePointerDown = (
        segId: string,
        idx: number,
        e: React.PointerEvent
    ) => {
        if (!editingPaths) return;
        dragInfo.current = { segId, idx };
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragInfo.current) return;
        const { segId, idx } = dragInfo.current;
        const coord = eventPoint(e);
        setPaths((prev) => {
            const seg = prev[segId];
            if (!seg) return prev;
            const newSeg: PathSegment = {
                ...seg,
                points: seg.points.map((p, pIdx) =>
                    pIdx === idx ? { x: coord.x, y: coord.y } : p
                ),
            };
            return { ...prev, [segId]: newSeg };
        });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (dragInfo.current) {
            (e.target as Element).releasePointerCapture(e.pointerId);
        }
        dragInfo.current = null;
    };

    // Insert new control point on double-click on segment polyline
    const handleDoubleClickLine = (
        segId: string,
        e: React.MouseEvent<SVGPolylineElement, MouseEvent>
    ) => {
        if (!editingPaths) return;
        const coord = eventPoint(e as unknown as React.PointerEvent);
        setPaths((prev) => {
            const seg = prev[segId];
            if (!seg) return prev;
            // find nearest segment between two points to insert after
            let insertIdx = 0;
            let bestDist = Infinity;
            for (let i = 0; i < seg.points.length - 1; i++) {
                const a = seg.points[i]!;
                const b = seg.points[i + 1]!;
                // distance from point to segment (approx squared)
                const t = ((coord.x - a.x) * (b.x - a.x) + (coord.y - a.y) * (b.y - a.y)) / (
                    (b.x - a.x) ** 2 + (b.y - a.y) ** 2 || 1
                );
                const proj = {
                    x: a.x + t * (b.x - a.x),
                    y: a.y + t * (b.y - a.y),
                };
                const dist2 = (coord.x - proj.x) ** 2 + (coord.y - proj.y) ** 2;
                if (dist2 < bestDist) {
                    bestDist = dist2;
                    insertIdx = i + 1;
                }
            }
            const newPoints = [...seg.points];
            newPoints.splice(insertIdx, 0, coord);
            return { ...prev, [segId]: { ...seg, points: newPoints } };
        });
    };

    if (!editingPaths) return null;

    // Need to place svgRef; This component is rendered inside SubwayMap's g.
    // We will forward ref of parent SVG using context? Instead we detect via closest svg.
    // We'll set ref via effect later.

    return (
        <g
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            ref={(node) => {
                if (node) {
                    groupRef.current = node as unknown as SVGGElement;
                    // Find enclosing svg element
                    const svg = (node as SVGGElement).ownerSVGElement || (node as unknown as SVGSVGElement);
                    svgRef.current = svg;
                }
            }}
        >
            {Object.values(paths).map((seg) => {
                const ptsStr = seg.points.map((p) => `${p.x},${p.y}`).join(" ");
                return (
                    <g key={seg.id}>
                        {/* segment polyline */}
                        <polyline
                            points={ptsStr}
                            fill="none"
                            stroke="#000000"
                            strokeWidth={2}
                            onDoubleClick={(e) => handleDoubleClickLine(seg.id, e)}
                            style={{ cursor: "pointer" }}
                        />
                        {/* control points (exclude first & last station points) */}
                        {seg.points.map((pt, idx) => {
                            const isEndpoint = idx === 0 || idx === seg.points.length - 1;
                            if (isEndpoint) return null;
                            return (
                                <circle
                                    key={`${seg.id}-pt-${idx}`}
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={6}
                                    fill="#ffffff"
                                    stroke="#000000"
                                    strokeWidth={2}
                                    onPointerDown={(e) => handlePointerDown(seg.id, idx, e)}
                                    onDoubleClick={() => {
                                        if (!editingPaths) return;
                                        setPaths((prev) => {
                                            const currentSeg = prev[seg.id];
                                            if (!currentSeg) return prev;
                                            // prevent deleting endpoints and ensure at least 3 points remain
                                            if (idx === 0 || idx === currentSeg.points.length - 1 || currentSeg.points.length <= 3)
                                                return prev;
                                            const newPts = currentSeg.points.filter((__, pIdx: number) => pIdx !== idx);
                                            return { ...prev, [seg.id]: { ...currentSeg, points: newPts } };
                                        });
                                    }}
                                    style={{ cursor: "move" }}
                                />
                            );
                        })}
                    </g>
                );
            })}
        </g>
    );
} 
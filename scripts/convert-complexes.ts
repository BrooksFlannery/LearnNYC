import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { COMPLEXES } from '../src/lib/data/complexes.ts';
import type { StationComplex } from '../src/lib/definitions/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const outFile = path.resolve(__dirname, '../src/lib/data/complexes.ts');

    const header = `// AUTO-GENERATED FILE – run npm run convert:complexes to regenerate\n` +
        `// ${new Date().toISOString()}\n\n` +
        `import type { StationComplex } from "../definitions/types";\n\n`;

    const complexesArray = (COMPLEXES as StationComplex[]).map(c => ({ id: c.id, stationIds: c.stationIds }));

    const complexesCode = `export const COMPLEXES: readonly StationComplex[] = ${JSON.stringify(complexesArray, null, 2)} as const;\n\n`;

    const derived = `export const COMPLEXES_BY_ID: Record<string, readonly string[]> = Object.fromEntries(\n  COMPLEXES.map(c => [c.id, c.stationIds]),\n) as const;\n\nexport const STATION_TO_COMPLEX: Record<string, string> = COMPLEXES.reduce((acc, c) => {\n  c.stationIds.forEach(id => (acc[id] = c.id));\n  return acc;\n}, {} as Record<string, string>);\n`;

    await fs.writeFile(outFile, header + complexesCode + derived, 'utf8');
    console.log(`complexes.ts rewritten with ${COMPLEXES.length} complexes.`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
}); 
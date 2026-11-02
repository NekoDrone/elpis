export type LevelTable = {
    expToNext: number[];
    maxLevel: number;
};

export function parseLevelingCsv(csv: string): LevelTable {
    const [header, ...rows] = csv.trim().split(/\r?\n/);
    const columns = header.split(",");
    const levelCol = columns.indexOf("#");
    const expCol = columns.indexOf("ExpToNext");
    if (levelCol < 0 || expCol < 0) {
        throw new Error("leveling.csv must have '#' and 'ExpToNext' columns");
    }

    const expToNext: number[] = [];
    let lastLevelWithExp = 0;
    for (const row of rows) {
        const cells = row.split(",");
        const level = Number(cells[levelCol]);
        const exp = Number(cells[expCol]);
        if (!Number.isInteger(level) || !Number.isFinite(exp)) continue;
        expToNext[level] = exp;
        if (level >= 1 && exp > 0) lastLevelWithExp = level;
    }

    return { expToNext, maxLevel: lastLevelWithExp };
}

export type CalculateInput = {
    table: LevelTable;
    startLevel: number;
    currentExp: number;
    endLevel: number;
    expPerRepeat: number;
};

export type CalculateError =
    | "start-out-of-range"
    | "end-out-of-range"
    | "end-not-after-start"
    | "current-exp-too-high"
    | "invalid-exp-per-repeat";

export type CalculateResult =
    | {
        ok: true;
        totalExp: number;
        repeats: number;
        leftoverExp: number;
    }
    | { ok: false; error: CalculateError };

export function calculate({
    table,
    startLevel,
    currentExp,
    endLevel,
    expPerRepeat,
}: CalculateInput): CalculateResult {
    const { expToNext, maxLevel } = table;
    if (!(startLevel >= 1 && startLevel < maxLevel)) {
        return { ok: false, error: "start-out-of-range" };
    }
    if (!(endLevel >= 1 && endLevel <= maxLevel)) {
        return { ok: false, error: "end-out-of-range" };
    }
    if (endLevel <= startLevel) {
        return { ok: false, error: "end-not-after-start" };
    }
    if (currentExp >= expToNext[startLevel]) {
        return { ok: false, error: "current-exp-too-high" };
    }
    if (!(expPerRepeat > 0)) {
        return { ok: false, error: "invalid-exp-per-repeat" };
    }

    let totalExp = expToNext[startLevel] - currentExp;
    for (let level = startLevel + 1; level < endLevel; level++) {
        totalExp += expToNext[level];
    }

    const repeats = Math.ceil(totalExp / expPerRepeat);
    return {
        ok: true,
        totalExp,
        repeats,
        leftoverExp: repeats * expPerRepeat - totalExp,
    };
}

export const LEVELING_CSV_PATH = "/data/leveling.csv";
export const LEVELING_CSV_REPO_URL =
    "https://github.com/NekoDrone/elpis/blob/main/apps/kairos/public/data/leveling.csv";

export async function loadLevelingTable(): Promise<LevelTable> {
    const res = await fetch(LEVELING_CSV_PATH);
    if (!res.ok) throw new Error("Failed to load leveling data");
    return parseLevelingCsv(await res.text());
}

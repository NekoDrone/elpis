import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExpTable } from "#/components/exp/Table";
import { ElpisMark } from "#/components/brand/ElpisMark";
import { calculate, loadLevelingTable } from "#/lib/leveling";
import type { CalculateError } from "#/lib/leveling";
import { Inline } from "#/components/inputs/Inline";
import { Num } from "#/components/display/Num";

type Search = {
    start?: number;
    exp?: number;
    end?: number;
    per?: number;
};

function numberParam(value: unknown): number | undefined {
    const n = typeof value === "string" ? Number(value) : value;
    return typeof n === "number" && Number.isFinite(n) && n >= 0
        ? n
        : undefined;
}

export const Route = createFileRoute("/")({
    validateSearch: (search: Record<string, unknown>): Search => ({
        start: numberParam(search.start),
        exp: numberParam(search.exp),
        end: numberParam(search.end),
        per: numberParam(search.per),
    }),
    loader: loadLevelingTable,
    component: Home,
});

const ERROR_MESSAGES: Record<CalculateError, string> = {
    "start-out-of-range": "Start level is out of range.",
    "end-out-of-range": "End level is out of range.",
    "end-not-after-start": "End level must be higher than start level.",
    "current-exp-too-high":
        "Current EXP must be less than the EXP needed for your start level.",
    "invalid-exp-per-repeat": "Enter how much EXP one repeat gives.",
};

const format = (n: number) => n.toLocaleString("en-US");

function parseNumber(value: string): number {
    const cleaned = value.replace(/[,\s]/g, "");
    return cleaned === "" ? NaN : Number(cleaned);
}

function Home() {
    const table = Route.useLoaderData();
    const search = Route.useSearch();
    const navigate = Route.useNavigate();

    const [start, setStart] = useState(String(search.start ?? 1));
    const [exp, setExp] = useState(String(search.exp ?? 0));
    const [end, setEnd] = useState(String(search.end ?? table.maxLevel));
    const [per, setPer] = useState(
        search.per === undefined ? "" : String(search.per),
    );

    const startLevel = parseNumber(start);
    const currentExp = parseNumber(exp);
    const endLevel = parseNumber(end);
    const expPerRepeat = parseNumber(per);

    useEffect(() => {
        const keep = (n: number) => (Number.isFinite(n) ? n : undefined);
        void navigate({
            search: {
                start: keep(startLevel),
                exp: keep(currentExp),
                end: keep(endLevel),
                per: keep(expPerRepeat),
            },
            replace: true,
        });
    }, [navigate, startLevel, currentExp, endLevel, expPerRepeat]);

    const result = useMemo(
        () =>
            calculate({
                table,
                startLevel,
                currentExp: Number.isNaN(currentExp) ? 0 : currentExp,
                endLevel,
                expPerRepeat,
            }),
        [table, startLevel, currentExp, endLevel, expPerRepeat],
    );

    return (
        <main className="min-h-screen bg-elp-g-light-canvas px-4 py-10 text-elp-g-light-text dark:bg-elp-g-dark-canvas dark:text-elp-g-dark-text">
            <div className="mx-auto flex max-w-md flex-col gap-6">
                <header className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <ElpisMark size={22} />
                        <h1 className="text-xl font-semibold tracking-tight">
                            Kairos
                        </h1>
                    </div>
                </header>

                <form
                    className="flex flex-col gap-5 rounded-lg bg-elp-g-light-surface p-6 dark:bg-elp-g-dark-surface"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <p className="text-xl leading-loose">
                        <span className="block">
                            Starting at level{" "}
                            <Inline
                                label="Start level"
                                value={start}
                                onChange={setStart}
                                width="w-16"
                            />
                            ,
                        </span>
                        <span className="block">
                            getting{" "}
                            <Inline
                                label="EXP per repeat"
                                value={per}
                                onChange={setPer}
                                width="w-32"
                                placeholder="0"
                            />{" "}
                            EXP per repeat, you'll need{" "}
                            <Num>
                                {result.ok ? format(result.repeats) : "-"}
                            </Num>{" "}
                            {result.ok && result.repeats === 1
                                ? "repeat"
                                : "repeats"}
                        </span>
                        <span className="block">
                            to reach level{" "}
                            <Inline
                                label="End level"
                                value={end}
                                onChange={setEnd}
                                width="w-16"
                            />
                            .
                        </span>
                    </p>

                    <div
                        aria-live="polite"
                        className="flex flex-col gap-3 border-t border-elp-g-light-overlay pt-5 text-sm text-elp-g-light-subtext dark:border-elp-g-dark-overlay dark:text-elp-g-dark-subtext"
                    >
                        <label className="flex items-center gap-2">
                            EXP already earned in your start level
                            <Inline
                                label="Current EXP"
                                value={exp}
                                onChange={setExp}
                                width="w-28"
                                small
                            />
                        </label>
                        {result.ok ? (
                            <p>
                                {format(result.totalExp)} EXP in total
                                {result.leftoverExp > 0 &&
                                    `, with ${format(result.leftoverExp)} to spare`}
                                .
                            </p>
                        ) : (
                            <p>{ERROR_MESSAGES[result.error]}</p>
                        )}
                    </div>

                    <ExpTable
                        table={table}
                        startLevel={startLevel}
                        endLevel={endLevel}
                        currentExp={currentExp}
                    />
                </form>
            </div>
        </main>
    );
}

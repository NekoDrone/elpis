import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExpTable } from "#/components/exp/Table";
import { ElpisMark } from "#/components/brand/ElpisMark";
import { calculate, loadLevelingTable, withBonus } from "#/lib/leveling";
import type { CalculateError } from "#/lib/leveling";
import { Inline } from "#/components/inputs/Inline";
import { Num } from "#/components/display/Num";
import { Drawer } from "#/components/containers/Drawer";
import { BonusPanel } from "#/components/exp/BonusPanel";
import { BadgePlus } from "lucide-react";
import { BONUSES_BY_ID } from "#/lib/bonuses";

type Search = {
    start?: number;
    exp?: number;
    end?: number;
    per?: number;
    bonus?: number;
    bonuses?: string;
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
        bonus: numberParam(search.bonus),
        bonuses:
            typeof search.bonuses === "string" && search.bonuses !== ""
                ? search.bonuses
                : undefined,
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
    const [bonus, setBonus] = useState(
        search.bonus === undefined ? "" : String(search.bonus),
    );

    const [checked, setChecked] = useState<ReadonlySet<string>>(
        () =>
            new Set(
                (search.bonuses ?? "")
                    .split(",")
                    .filter((id) => BONUSES_BY_ID.has(id)),
            ),
    );

    const startLevel = parseNumber(start);
    const currentExp = parseNumber(exp);
    const endLevel = parseNumber(end);
    const expPerRepeat = parseNumber(per);
    const bonusPercent = Number.isNaN(parseNumber(bonus))
        ? 0
        : parseNumber(bonus);
    const checkedIds = [...checked].sort().join(",");

    const toggleBonus = (id: string) => {
        const entry = BONUSES_BY_ID.get(id);
        if (!entry) return;
        const on = !checked.has(id);
        const next = new Set(checked);
        if (on) next.add(id);
        else next.delete(id);
        setChecked(next);
        const current = Number.isNaN(parseNumber(bonus))
            ? 0
            : parseNumber(bonus);
        const sum =
            Math.round((current + (on ? 1 : -1) * entry.percent) * 1e6) / 1e6;
        setBonus(String(Math.max(0, sum)));
    };

    useEffect(() => {
        const keep = (n: number) => (Number.isFinite(n) ? n : undefined);
        void navigate({
            search: {
                start: keep(startLevel),
                exp: keep(currentExp),
                end: keep(endLevel),
                per: keep(expPerRepeat),
                bonus: bonusPercent > 0 ? bonusPercent : undefined,
                bonuses: checkedIds === "" ? undefined : checkedIds,
            },
            replace: true,
        });
    }, [
        navigate,
        startLevel,
        currentExp,
        endLevel,
        expPerRepeat,
        bonusPercent,
        checkedIds,
    ]);

    const result = useMemo(
        () =>
            calculate({
                table,
                startLevel,
                currentExp: Number.isNaN(currentExp) ? 0 : currentExp,
                endLevel,
                expPerRepeat,
                bonusPercent,
            }),
        [table, startLevel, currentExp, endLevel, expPerRepeat, bonusPercent],
    );

    const title = result.ok
        ? `Kairos - ${format(result.repeats)} ${result.repeats === 1 ? "repeat" : "repeats"} from ${startLevel} to ${endLevel}`
        : "Kairos - FFXIV Leveling Calculator";

    return (
        <main className="min-h-screen bg-elp-arc-light-canvas px-4 py-10 text-elp-arc-light-text dark:bg-elp-arc-dark-canvas dark:text-elp-arc-dark-text">
            <title>{title}</title>
            <div className="mx-auto flex max-w-md flex-col gap-6">
                <header className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <ElpisMark size={22} />
                        <h1 className="text-xl font-semibold tracking-tight">
                            Kairos
                        </h1>
                    </div>
                </header>

                <Drawer
                    icon={BadgePlus}
                    label="Bonuses"
                    panel={
                        <BonusPanel
                            bonus={bonus}
                            onBonusChange={setBonus}
                            checked={checked}
                            onToggle={toggleBonus}
                            effectiveExpPerRepeat={withBonus(
                                expPerRepeat > 0 ? expPerRepeat : 0,
                                bonusPercent,
                            )}
                        />
                    }
                >
                    <form
                        className="flex flex-col gap-5 rounded-lg bg-elp-arc-light-surface p-6 dark:bg-elp-arc-dark-surface"
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
                            className="flex flex-col gap-3 border-t border-elp-arc-light-overlay pt-5 text-sm text-elp-arc-light-subtext dark:border-elp-arc-dark-overlay dark:text-elp-arc-dark-subtext"
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
                                    {bonusPercent > 0 &&
                                        ` (+${format(bonusPercent)}% bonus)`}
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
                </Drawer>
            </div>
        </main>
    );
}

import { Accordion } from "#/components/containers/Accordion";
import { LEVELING_CSV_REPO_URL } from "#/lib/leveling";
import type { LevelTable } from "#/lib/leveling";

const format = (n: number) => n.toLocaleString("en-US");

const cell = "px-4 py-1.5";
const rowBorder =
    "border-t border-elp-arc-light-overlay dark:border-elp-arc-dark-overlay";

/**
 * Levels from `start` up to (not including) `end` are the ones whose EXP counts
 * towards the goal. Returns undefined unless both are usable.
 */
function targetRange(table: LevelTable, start: number, end: number) {
    const valid =
        Number.isInteger(start) &&
        Number.isInteger(end) &&
        start >= 1 &&
        end <= table.maxLevel &&
        start < end;
    return valid ? { first: start, last: end - 1 } : undefined;
}

export function ExpTable({
    table,
    startLevel,
    endLevel,
    currentExp,
}: {
    table: LevelTable;
    startLevel: number;
    endLevel: number;
    currentExp: number;
}) {
    const range = targetRange(table, startLevel, endLevel);
    const first = range?.first ?? 1;
    const last = range?.last ?? table.maxLevel;
    const levels = Array.from(
        { length: last - first + 1 },
        (_, i) => first + i,
    );

    // Same rule as calculate(): ignore progress that isn't below the start level's cost.
    const earned =
        range && currentExp > 0 && currentExp < table.expToNext[first]
            ? currentExp
            : 0;
    const total = range
        ? levels.reduce((sum, level) => sum + table.expToNext[level], 0) -
        earned
        : 0;

    return (
        <Accordion title="See breakdown">
            <div className="flex flex-col gap-3">
                <p className="text-sm text-elp-arc-light-subtext dark:text-elp-arc-dark-subtext">
                    {range
                        ? `EXP needed from level ${first} to level ${last + 1}.`
                        : `EXP needed to go from each level to the next. Enter a valid start and end level to narrow this down.`}
                </p>
                <div className="max-h-80 overflow-auto rounded-md border border-elp-arc-light-overlay dark:border-elp-arc-dark-overlay">
                    <table className="w-full text-sm tabular-nums">
                        <thead className="sticky top-0 bg-elp-arc-light-surface text-left text-elp-arc-light-subtext dark:bg-elp-arc-dark-surface dark:text-elp-arc-dark-subtext">
                            <tr>
                                <th className={`${cell} font-medium`}>Level</th>
                                <th
                                    className={`${cell} text-right font-medium`}
                                >
                                    EXP to next level
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {levels.map((level) => (
                                <tr key={level} className={rowBorder}>
                                    <td className={cell}>{level}</td>
                                    <td className={`${cell} text-right`}>
                                        {format(table.expToNext[level])}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {range && (
                            <tfoot>
                                {earned > 0 && (
                                    <tr className={rowBorder}>
                                        <td className={cell}>Already earned</td>
                                        <td
                                            className={`${cell} text-right text-elp-arc-light-subtext dark:text-elp-arc-dark-subtext`}
                                        >
                                            −{format(earned)}
                                        </td>
                                    </tr>
                                )}
                                <tr className={`${rowBorder} font-semibold`}>
                                    <td className={cell}>Total required</td>
                                    <td
                                        className={`${cell} text-right text-elp-arc-light-positive dark:text-elp-arc-dark-positive`}
                                    >
                                        {format(total)}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
                <p className="text-xs text-elp-arc-light-subtext dark:text-elp-arc-dark-subtext">
                    The value at max level ({table.maxLevel}) is a placeholder.
                    Source data can be found at{" "}
                    <a
                        href={LEVELING_CSV_REPO_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-elp-arc-light-info underline underline-offset-4 dark:text-elp-arc-dark-info"
                    >
                        leveling.csv
                    </a>
                </p>
            </div>
        </Accordion>
    );
}

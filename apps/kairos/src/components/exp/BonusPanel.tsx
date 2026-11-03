import { Tooltip } from "#/components/containers/Tooltip";
import { Inline } from "#/components/inputs/Inline";
import { Info } from "lucide-react";
import { BONUS_CATEGORIES } from "#/lib/bonuses";

const format = (n: number) => n.toLocaleString("en-US");
const muted = "text-elp-arc-light-subtext dark:text-elp-arc-dark-subtext";

export function BonusPanel({
    bonus,
    onBonusChange,
    checked,
    onToggle,
    effectiveExpPerRepeat,
}: {
    bonus: string;
    onBonusChange: (value: string) => void;
    checked: ReadonlySet<string>;
    onToggle: (id: string) => void;
    effectiveExpPerRepeat: number;
}) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold">EXP bonus</h2>
            <p className={`text-sm ${muted}`}>
                {format(effectiveExpPerRepeat)} EXP per repeat after applied
                bonus.
            </p>
            <label className={`flex items-center gap-2 text-sm ${muted}`}>
                Applied bonus
                <Inline
                    label="Applied EXP bonus percent"
                    value={bonus}
                    onChange={onBonusChange}
                    width="w-16"
                    placeholder="0"
                    small
                />
                %
            </label>
            {BONUS_CATEGORIES.map((category) => (
                <fieldset key={category.title} className="flex flex-col gap-1">
                    <legend className={`mb-1 text-xs font-medium ${muted}`}>
                        {category.title}
                    </legend>
                    {category.bonuses.map((b) => (
                        <label
                            key={b.id}
                            className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                            <input
                                type="checkbox"
                                checked={checked.has(b.id)}
                                onChange={() => onToggle(b.id)}
                                className="accent-elp-arc-light-positive dark:accent-elp-arc-dark-positive"
                            />
                            <span className="flex-1">{b.label}</span>
                            {b.info && (
                                <Tooltip content={b.info} side="top">
                                    <button
                                        type="button"
                                        aria-label={`About ${b.label}`}
                                        className={`flex hover:text-elp-arc-light-text dark:hover:text-elp-arc-dark-text ${muted}`}
                                    >
                                        <Info aria-hidden size={14} />
                                    </button>
                                </Tooltip>
                            )}
                            <span className={`tabular-nums ${muted}`}>
                                {b.percent}%
                            </span>
                        </label>
                    ))}
                </fieldset>
            ))}
        </div>
    );
}

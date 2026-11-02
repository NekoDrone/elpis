import { Inline } from "#/components/inputs/Inline";

const format = (n: number) => n.toLocaleString("en-US");

export function BonusPanel({
    bonus,
    onBonusChange,
    effectiveExpPerRepeat,
}: {
    bonus: string;
    onBonusChange: (value: string) => void;
    effectiveExpPerRepeat?: number;
}) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold">EXP bonus</h2>
            <label className="flex items-center gap-2 text-sm text-elp-g-light-subtext dark:text-elp-g-dark-subtext">
               Applied bonus: 
                <Inline
                    label="Flat EXP bonus percent"
                    value={bonus}
                    onChange={onBonusChange}
                    width="w-16"
                    placeholder="0"
                    small
                />
                %
            </label>
            {effectiveExpPerRepeat !== undefined && (
                <p className="text-sm text-elp-g-light-subtext dark:text-elp-g-dark-subtext">
                    {format(effectiveExpPerRepeat)} EXP per repeat with the
                    bonus.
                </p>
            )}
        </div>
    );
}

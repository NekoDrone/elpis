export const Inline = ({
    label,
    value,
    onChange,
    width,
    placeholder,
    small,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    width: string;
    placeholder?: string;
    small?: boolean;
}) => {
    return (
        <input
            type="text"
            inputMode="numeric"
            aria-label={label}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={`${width} ${small ? "text-sm" : ""} rounded-md border border-elp-arc-light-overlay bg-elp-arc-light-canvas px-2 py-0.5 text-center text-elp-arc-light-text tabular-nums outline-none focus:border-elp-arc-light-positive dark:border-elp-arc-dark-overlay dark:bg-elp-arc-dark-canvas dark:text-elp-arc-dark-text dark:focus:border-elp-arc-dark-positive`}
        />
    );
};

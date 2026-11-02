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
            className={`${width} ${small ? "text-sm" : ""} rounded-md border border-elp-g-light-overlay bg-elp-g-light-canvas px-2 py-0.5 text-center text-elp-g-light-text tabular-nums outline-none focus:border-elp-g-light-positive dark:border-elp-g-dark-overlay dark:bg-elp-g-dark-canvas dark:text-elp-g-dark-text dark:focus:border-elp-g-dark-positive`}
        />
    );
};

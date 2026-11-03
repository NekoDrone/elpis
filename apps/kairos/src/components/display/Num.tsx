import type { ReactNode } from "react";

export const Num = ({ children }: { children: ReactNode }) => {
    return (
        <strong className="font-semibold text-elp-arc-light-info tabular-nums dark:text-elp-arc-dark-info">
            {children}
        </strong>
    );
};

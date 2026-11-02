import type { ReactNode } from "react";

export const Num = ({ children }: { children: ReactNode }) => {
    return (
        <strong className="font-semibold text-elp-g-light-positive tabular-nums dark:text-elp-g-dark-positive">
            {children}
        </strong>
    );
};

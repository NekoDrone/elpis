import { useId, useState, useSyncExternalStore } from "react";
import type { ComponentType, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const WIDE_QUERY = "(min-width: 64rem)";
const PANEL_WIDTH = 240;

function useIsWide() {
    return useSyncExternalStore(
        (onChange) => {
            const mql = window.matchMedia(WIDE_QUERY);
            mql.addEventListener("change", onChange);
            return () => mql.removeEventListener("change", onChange);
        },
        () => window.matchMedia(WIDE_QUERY).matches,
        () => false,
    );
}

export function Drawer({
    icon: Icon,
    label,
    children,
    panel,
    defaultOpen = false,
}: {
    icon: ComponentType<{ "aria-hidden"?: boolean; size?: number }>;
    label: string;
    children: ReactNode;
    panel: ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    const wide = useIsWide();
    const reduceMotion = useReducedMotion();
    const panelId = useId();
    const transition = reduceMotion
        ? { duration: 0 }
        : ({ type: "spring", stiffness: 380, damping: 36 } as const);

    const button = (
        <button
            type="button"
            aria-label={label}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
            className="flex items-center justify-center gap-2 rounded-lg bg-elp-arc-light-surface p-2 text-sm text-elp-arc-light-subtext hover:text-elp-arc-light-text lg:h-fit lg:self-start lg:rounded-l-none lg:py-3 dark:bg-elp-arc-dark-surface dark:text-elp-arc-dark-subtext dark:hover:text-elp-arc-dark-text"
        >
            <Icon aria-hidden size={18} />
            {!wide && <span>{label}</span>}
        </button>
    );

    const panelClass =
        "rounded-lg bg-elp-arc-light-surface p-5 lg:overflow-y-auto lg:rounded-l-none dark:bg-elp-arc-dark-surface";

    return (
        <div className="relative">
            <div className="relative z-10">{children}</div>
            {wide ? (
                <motion.aside
                    className="absolute top-0 left-full flex h-full flex-row-reverse"
                    initial={false}
                    animate={{ x: open ? 0 : -PANEL_WIDTH }}
                    transition={transition}
                >
                    {button}
                    <div
                        id={panelId}
                        inert={!open}
                        style={{ width: PANEL_WIDTH }}
                        className={panelClass}
                    >
                        {panel}
                    </div>
                </motion.aside>
            ) : (
                <aside className="mt-2 flex flex-col gap-2">
                    {button}
                    <motion.div
                        id={panelId}
                        inert={!open}
                        initial={false}
                        animate={{
                            height: open ? "auto" : 0,
                            opacity: open ? 1 : 0,
                        }}
                        transition={transition}
                        className="overflow-hidden rounded-lg"
                    >
                        <div className={panelClass}>{panel}</div>
                    </motion.div>
                </aside>
            )}
        </div>
    );
}

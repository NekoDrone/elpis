import { ChevronDown, ChevronUp } from "lucide-react";
import { useId, useState } from "react";
import type { ReactNode } from "react";

export function Accordion({
    title,
    children,
    defaultOpen = false,
}: {
    title: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    const panelId = useId();

    return (
        <div className="border-t border-elp-g-light-overlay pt-4 dark:border-elp-g-dark-overlay">
            <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-2 text-left text-sm text-elp-g-light-subtext hover:text-elp-g-light-text dark:text-elp-g-dark-subtext dark:hover:text-elp-g-dark-text"
            >
                <span>{title}</span>
                <ChevronDown
                    aria-hidden
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            <div id={panelId} hidden={!open} className="pt-4">
                {open && children}
            </div>
        </div>
    );
}

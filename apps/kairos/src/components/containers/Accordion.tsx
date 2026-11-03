import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { ReactNode } from "react";

/**
 * A collapsible section with a toggleable heading. The panel content is only
 * mounted while open.
 *
 * @param props.title - Heading shown in the toggle button.
 * @param props.children - Content revealed when the section is open.
 * @param props.defaultOpen - Whether the section starts open. Defaults to
 * `false`.
 */
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
        <div className="border-t border-elp-arc-light-overlay pt-4 dark:border-elp-arc-dark-overlay">
            <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-2 text-left text-sm text-elp-arc-light-subtext hover:text-elp-arc-light-text dark:text-elp-arc-dark-subtext dark:hover:text-elp-arc-dark-text"
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

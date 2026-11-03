import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

export type TooltipSide = "top" | "bottom" | "left" | "right";

const GAP = 8;
const VIEWPORT_MARGIN = 8;

const SIDE_OFFSET: Record<TooltipSide, { x?: number; y?: number }> = {
    top: { y: 4 },
    bottom: { y: -4 },
    left: { x: 4 },
    right: { x: -4 },
};

const OPPOSITE: Record<TooltipSide, TooltipSide> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
};

const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(n, max));

function place(side: TooltipSide, trigger: DOMRect, tip: DOMRect) {
    switch (side) {
        case "top":
            return {
                top: trigger.top - tip.height - GAP,
                left: trigger.left + (trigger.width - tip.width) / 2,
            };
        case "bottom":
            return {
                top: trigger.bottom + GAP,
                left: trigger.left + (trigger.width - tip.width) / 2,
            };
        case "left":
            return {
                top: trigger.top + (trigger.height - tip.height) / 2,
                left: trigger.left - tip.width - GAP,
            };
        case "right":
            return {
                top: trigger.top + (trigger.height - tip.height) / 2,
                left: trigger.right + GAP,
            };
    }
}

function fits(pos: { top: number; left: number }, tip: DOMRect) {
    return (
        pos.top >= VIEWPORT_MARGIN &&
        pos.left >= VIEWPORT_MARGIN &&
        pos.top + tip.height <= window.innerHeight - VIEWPORT_MARGIN &&
        pos.left + tip.width <= window.innerWidth - VIEWPORT_MARGIN
    );
}

/**
 * Shows `content` in a floating panel when `children` is hovered or focused.
 *
 * The panel is rendered in a portal so ancestors with `overflow` or
 * `transform` can't clip it. It flips to the opposite side when the preferred
 * side has no room, and is clamped to the viewport.
 *
 * @param props.content - Contents of the tooltip panel.
 * @param props.children - The trigger element. Should be focusable (e.g. a
 * button or link) so keyboard users can reach the tooltip.
 * @param props.side - Preferred side of the trigger to render on. Defaults to
 * `"top"`.
 *
 */
export function Tooltip({
    content,
    children,
    side = "top",
}: {
    content: ReactNode;
    children: ReactNode;
    side?: TooltipSide;
}) {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<{
        top: number;
        left: number;
        side: TooltipSide;
    } | null>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);
    const tipRef = useRef<HTMLSpanElement>(null);
    const tooltipId = useId();
    const reduceMotion = useReducedMotion();

    useLayoutEffect(() => {
        if (!open) return;

        const update = () => {
            if (!triggerRef.current || !tipRef.current) return;
            const trigger = triggerRef.current.getBoundingClientRect();
            const tip = tipRef.current.getBoundingClientRect();
            let resolved = side;
            let pos = place(resolved, trigger, tip);
            if (!fits(pos, tip)) {
                const flipped = place(OPPOSITE[side], trigger, tip);
                if (fits(flipped, tip)) {
                    resolved = OPPOSITE[side];
                    pos = flipped;
                }
            }
            setPlacement({
                side: resolved,
                top: clamp(
                    pos.top,
                    VIEWPORT_MARGIN,
                    window.innerHeight - tip.height - VIEWPORT_MARGIN,
                ),
                left: clamp(
                    pos.left,
                    VIEWPORT_MARGIN,
                    window.innerWidth - tip.width - VIEWPORT_MARGIN,
                ),
            });
        };

        update();
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, true);
        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
        };
    }, [open, side]);

    const close = () => setOpen(false);
    const offset = reduceMotion ? {} : SIDE_OFFSET[placement?.side ?? side];

    return (
        <span
            ref={triggerRef}
            className="inline-flex"
            aria-describedby={open ? tooltipId : undefined}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={close}
            onFocus={() => setOpen(true)}
            onBlur={close}
            onKeyDown={(e) => {
                if (e.key === "Escape") close();
            }}
        >
            {children}
            {createPortal(
                <AnimatePresence>
                    {open && (
                        <span
                            ref={tipRef}
                            className="pointer-events-none fixed z-50 w-max max-w-64"
                            style={{
                                top: placement?.top ?? 0,
                                left: placement?.left ?? 0,
                                visibility: placement ? "visible" : "hidden",
                            }}
                        >
                            <motion.span
                                id={tooltipId}
                                role="tooltip"
                                initial={{ opacity: 0, ...offset }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                exit={{ opacity: 0, ...offset }}
                                transition={{
                                    duration: reduceMotion ? 0 : 0.12,
                                }}
                                className="block rounded-md border border-elp-arc-light-overlay bg-elp-arc-light-surface px-3 py-2 text-sm text-elp-arc-light-text shadow-lg dark:border-elp-arc-dark-overlay dark:bg-elp-arc-dark-surface dark:text-elp-arc-dark-text"
                            >
                                {content}
                            </motion.span>
                        </span>
                    )}
                </AnimatePresence>,
                document.body,
            )}
        </span>
    );
}

export type Bonus = { id: string; label: string; percent: number };
export type BonusCategory = { title: string; bonuses: Bonus[] };

export const BONUS_CATEGORIES: BonusCategory[] = [
    {
        title: "DoH/DoL",
        bonuses: [
            { id: "manual-full", label: "Manuals (Full)", percent: 150 },
            { id: "manual-half", label: "Manuals (Half)", percent: 75 },
            { id: "squadron-manual", label: "Squadron Manual", percent: 20 },
            { id: "fc-action-1", label: "FC Action I", percent: 5 },
            { id: "fc-action-2", label: "FC Action II", percent: 10 },
            { id: "fc-action-3", label: "FC Action III", percent: 20 },
        ],
    },
    {
        title: "DoW/DoM",
        bonuses: [
            { id: "armoury-1-89", label: "Armoury (1-89)", percent: 100 },
            {
                id: "armoury-90-100",
                label: "Armoury (90-100)",
                percent: 50,
            },
            { id: "heat-of-battle-1", label: "Heat of Battle I", percent: 5 },
            { id: "heat-of-battle-2", label: "Heat of Battle II", percent: 10 },
            {
                id: "heat-of-battle-3",
                label: "Heat of Battle III",
                percent: 15,
            },
        ],
    },
    {
        title: "Others",
        bonuses: [
            { id: "well-fed", label: "Well Fed", percent: 3 },
            {
                id: "earring",
                label: "Earring",
                percent: 30,
            },
            {
                id: "friendship-circlet",
                label: "Friendship Circlet",
                percent: 20,
            },
            {
                id: "brand-new-ring",
                label: "Brand-new Ring",
                percent: 30,
            },
            {
                id: "neophyte-ring",
                label: "Neophyte's Ring",
                percent: 30,
            },
            { id: "road-to-90", label: "Road to 90", percent: 100 },
            {
                id: "mentor",
                label: "Mentor Bonus",
                percent: 50,
            },
        ],
    },
];

export const BONUSES_BY_ID = new Map(
    BONUS_CATEGORIES.flatMap((c) => c.bonuses).map((b) => [b.id, b]),
);

"use client";

import { createTheme, type MantineColorsTuple } from "@mantine/core";

const primary: MantineColorsTuple = [
    "#fceaff",
    "#f0d1ff",
    "#d78df9",
    "#cb6df6",
    "#bb41f3",
    "#b126f2",
    "#ad18f2",
    "#970bd8",
    "#8705c1",
    "#7500aa",
];

export const theme = createTheme({
    /* Put your mantine theme override here */
    colors: {
        primary,
    },
    primaryColor: "primary",
    other: {
        /* Put your other theme overrides here */
    },
});

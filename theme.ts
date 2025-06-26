"use client";

import { createTheme, type MantineColorsTuple } from "@mantine/core";

const primary: MantineColorsTuple = [
    "#effde7",
    "#e1f8d4",
    "#c3efab",
    "#a2e67e",
    "#87de58",
    "#75d93f",
    "#6bd731",
    "#59be23",
    "#4da91b",
    "#3d920d",
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

"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@mantine/core";
import { useHover, useMouse } from "@mantine/hooks";
import { useIsMobile } from "~/modules/system";
import confetti from "canvas-confetti";

import styles from "./PunchableAvatar.module.scss";

interface PunchableAvatarOptions {
    src: string;
    soundUrl?: string | null;
    spread?: number;
    angle?: number;
    gravity?: number;
    scalar?: number;
    colors?: string[];
    shapes?: confetti.Shape[];
}

export function PunchableAvatar({
    src,
    soundUrl = null,
    spread = 90,
    angle = 90,
    gravity = 10,
    scalar = 1,
    colors = ["#aa0000", "#bb0000", "#cc0000"],
    shapes = ["square", "circle"],
}: PunchableAvatarOptions) {
    const { x: mouseX, y: mouseY } = useMouse();
    const [rotateValue, setRotateValue] = useState(0);
    const isMobile = useIsMobile();

    const { ref, hovered } = useHover();

    useEffect(() => {
        if (rotateValue != 0) {
            setTimeout(() => {
                if (!hovered && !isMobile) setRotateValue(0);
                if (isMobile) setRotateValue(0);
            }, 1000);
        }
    }, [hovered, isMobile, rotateValue]);

    return (
        <Avatar
            ref={ref}
            className={styles.avatar}
            style={{ rotate: `${rotateValue}deg` }}
            src={src}
            radius={"md"}
            size={"lg"}
            onClick={(e) => {
                e.currentTarget.getBoundingClientRect();
                e.preventDefault();

                if (soundUrl) {
                    const audio = new Audio(soundUrl);
                    audio.volume = 0.25;
                    void audio.play();
                }

                // Trigger confetti at mouse position
                void confetti({
                    particleCount: 100,
                    decay: 0.9,
                    spread: spread,
                    angle: angle,
                    scalar: scalar,
                    origin: {
                        x: Math.max(0, Math.min(1, mouseX / window.innerWidth)),
                        y: Math.max(0, Math.min(1, mouseY / window.innerHeight)),
                    },
                    zIndex: 1001,
                    gravity: gravity,
                    colors: colors,
                    shapes: shapes,
                });

                const random = Math.floor(Math.random() * 721) - 360; // -360 to 360
                setRotateValue(rotateValue + random + 15);
            }}
        />
    );
}

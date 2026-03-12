"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type CalendarProps = {
    selected: Date | undefined;
    onSelect: (date: Date | undefined) => void;
};

export function Calendar({ selected, onSelect }: CalendarProps) {
    const today = new Date();

    return (
        <div
            style={{
                border: "var(--border-thick) solid var(--fg)",
                background: "#fff",
                boxShadow: "6px 6px 0 #000000",
                padding: 12,
                maxWidth: 340,
            }}
        >
            <DayPicker
                mode="single"
                selected={selected}
                onSelect={onSelect}
                disabled={{ before: today }}
                styles={{
                    caption: { fontWeight: 800, textTransform: "uppercase" },
                    head_cell: {
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                    },
                    day: {
                        borderRadius: 0,
                        border: "1px solid #00000030",
                    },
                    day_selected: {
                        backgroundColor: "var(--accent-yellow)",
                        borderColor: "#000",
                        color: "#000",
                    },
                    day_today: {
                        borderColor: "#000",
                        fontWeight: 800,
                    },
                }}
            />
        </div>
    );
}
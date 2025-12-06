import React from "react";
import { cn } from "@/lib/utils";

export default function Asterisk({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 51"
            fill="currentColor"
            className={cn("w-6 h-6", className)}
        >
            <path d="M26.8767 50.0341L24.3807 31.4734L31.4158 24.9413L49.7407 28.805L47.0866 37.4099L33.996 31.6884L30.9182 34.5462L35.6546 48.0245L26.8767 50.0341ZM45.9361 11.1863L31.0757 22.6644L21.8426 19.7748L16.0647 1.94148L24.7693 -6.9784e-05L26.4385 14.1429L30.495 15.4255L39.7391 4.659L45.9361 11.1863ZM2.5808 14.4612L19.9372 21.5439L22.1353 30.9656L9.58822 44.9353L3.53771 38.2718L14.9592 29.8504L13.9805 25.7101L-2.68031e-05 22.9982L2.5808 14.4612Z" />
        </svg>
    );
}

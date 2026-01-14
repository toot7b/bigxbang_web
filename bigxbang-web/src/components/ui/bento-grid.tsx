"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
    href,
    onClick,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    href?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) => {
    const Content = () => (
        <>
            {header}
            <div className="md:group-hover/bento:translate-x-2 transition duration-200">
                {icon}
                <div className="font-clash font-medium text-neutral-200 text-lg mb-2 mt-2">
                    {title}
                </div>
                <div className="font-jakarta text-neutral-500 text-xs font-normal">
                    {description}
                </div>
            </div>
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                onClick={onClick}
                className={cn(
                    "row-span-1 rounded-xl group/bento md:hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-zinc-900 border border-white/10 justify-between flex flex-col space-y-4 cursor-pointer md:hover:scale-[1.02] active:scale-[0.98] active:brightness-90",
                    className
                )}
            >
                <Content />
            </Link>
        );
    }

    return (
        <div
            className={cn(
                "row-span-1 rounded-xl group/bento md:hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-zinc-900 border border-white/10 justify-between flex flex-col space-y-4 md:hover:scale-[1.02] active:scale-[0.98] active:brightness-90",
                className
            )}
        >
            <Content />
        </div>
    );
};

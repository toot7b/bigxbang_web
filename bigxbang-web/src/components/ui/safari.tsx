import type { HTMLAttributes } from "react"

const SAFARI_WIDTH = 1203
const SAFARI_HEIGHT = 753
const SCREEN_X = 1
const SCREEN_Y = 52
const SCREEN_WIDTH = 1200
const SCREEN_HEIGHT = 700

// Calculated percentages
const LEFT_PCT = (SCREEN_X / SAFARI_WIDTH) * 100
const TOP_PCT = (SCREEN_Y / SAFARI_HEIGHT) * 100
const WIDTH_PCT = (SCREEN_WIDTH / SAFARI_WIDTH) * 100
const HEIGHT_PCT = (SCREEN_HEIGHT / SAFARI_HEIGHT) * 100

type SafariMode = "default" | "simple"

export interface SafariProps extends HTMLAttributes<HTMLDivElement> {
    url?: string
    imageSrc?: string
    videoSrc?: string
    mode?: SafariMode
}

export function Safari({
    imageSrc,
    videoSrc,
    url,
    mode = "default",
    className,
    style,
    children,
    ...props
}: SafariProps) {
    // Allow children to be passed if no src provided (for our animation)
    const hasVideo = !!videoSrc
    const hasImage = !!imageSrc
    const hasContent = hasVideo || hasImage || !!children

    return (
        <div
            className={`relative inline-block w-full align-middle leading-none ${className ?? ""}`}
            style={{
                aspectRatio: `${SAFARI_WIDTH}/${SAFARI_HEIGHT}`,
                ...style,
            }}
            {...props}
        >
            <div
                className="absolute z-0 overflow-hidden"
                style={{
                    left: `${LEFT_PCT}%`,
                    top: `${TOP_PCT}%`,
                    width: `${WIDTH_PCT}%`,
                    height: `${HEIGHT_PCT}%`,
                    borderRadius: "0 0 19px 19px", // Matches frame clip
                    backgroundColor: "#050810", // Deep black background for the screen
                }}
            >
                {hasVideo && (
                    <video
                        className="block size-full object-cover"
                        src={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                    />
                )}

                {!hasVideo && imageSrc && (
                    <img
                        src={imageSrc}
                        alt=""
                        className="block size-full object-cover object-top"
                    />
                )}

                {/* Custom Children (Website Animation) */}
                {!hasVideo && !imageSrc && children && (
                    <div className="w-full h-full">
                        {children}
                    </div>
                )}


            </div>

            <svg
                viewBox={`0 0 ${SAFARI_WIDTH} ${SAFARI_HEIGHT}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 z-10 size-full pointer-events-none" // pointer-events-none to let click through if needed
                style={{ transform: "translateZ(0)" }}
            >
                <defs>
                    <clipPath id="path0">
                        <rect width={SAFARI_WIDTH} height={SAFARI_HEIGHT} fill="white" />
                    </clipPath>
                    {/* Exact Gradient from User Reference (.code-window) */}
                    <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(23, 32, 64, 0.92)" />
                        <stop offset="60%" stopColor="rgba(8, 12, 24, 0.94)" />
                        <stop offset="100%" stopColor="rgba(5, 8, 18, 0.96)" />
                    </linearGradient>
                </defs>

                <g clipPath="url(#path0)">
                    {/* Main Frame Background - Body Area (Transparent to show content) */}
                    <path
                        d="M0 52H1202V733C1202 744 1191 753 1182 753H20C9 753 0 744 0 733V52Z"
                        fill="none"
                        stroke="rgba(48, 110, 232, 0.38)"
                        strokeWidth="2"
                    />

                    {/* Header Bar - Slightly Lighter Overlay for contrast */}
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 20C0 9 9 0 20 0H1182C1193 0 1202 9 1202 20V52H0Z"
                        fill="url(#frameGradient)"
                        fillOpacity="0.8" // Let the gradient shine but maybe overlay? Or just same gradient.
                        stroke="rgba(48, 110, 232, 0.38)"
                        strokeWidth="1"
                    />
                    {/* Separator Line */}
                    <path d="M0 52H1202" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />

                    {/* Traffic Lights (Dots) - Keep Colored for contrast */}
                    <circle cx="27" cy="25" r="6" fill="#FF5F57" />
                    <circle cx="47" cy="25" r="6" fill="#FEBC2E" />
                    <circle cx="67" cy="25" r="6" fill="#28C840" />

                    {/* Address Input Field Background */}
                    <rect x="286" y="11" width="666" height="30" rx="8" fill="#1e2942" fillOpacity="0.5" stroke="rgba(255,255,255,0.05)" />

                    {/* Icons & Text - White/Grey */}
                    <g className="mix-blend-normal opacity-70">
                        <text
                            x="619"
                            y="30"
                            fill="white"
                            textAnchor="middle"
                            className="text-[20px] font-medium tracking-wide"
                            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
                        >
                            {url}
                        </text>
                        {/* Refresh Icon */}
                        <path transform="translate(85, 0)" d="M846 21C846 21 848 23 848 26C848 29 846 31 846 31M854 26C854 23.2386 851.761 21 849 21C846.239 21 844 23.2386 844 26C844 28.7614 846.239 31 849 31C850.5 31 853 29.5 853 29.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>

                    {mode === "default" && (
                        <g className="mix-blend-normal opacity-50">
                            {/* Back/Forward Arrows */}
                            <path d="M101.7 27.6H100.1C99.8 27.6 99.6 27.38 99.6 27.1V27.1C99.6 26.8 99.8 26.6 100.1 26.6H101.7C102 26.6 102.2 26.8 102.2 27.1V27.1C102.2 27.38 102 27.6 101.7 27.6Z" fill="white" />
                            <path d="M144.56 32.86C145.08 32.86 145.49 32.45 145.49 31.93C145.49 31.68 145.39 31.44 145.21 31.26L139.74 25.92L145.21 20.59C145.39 20.41 145.49 20.17 145.49 19.92C145.49 19.4 145.08 19 144.56 19C144.31 19 144.09 19.09 143.92 19.26L137.84 25.2C137.62 25.4 137.51 25.65 137.51 25.93C137.51 26.2 137.62 26.43 137.83 26.64L143.91 32.59C144.09 32.76 144.31 32.86 144.56 32.86Z" fill="white" />
                            <path d="M168.42 32.86C168.94 32.86 169.35 32.45 169.35 31.93C169.35 31.68 169.25 31.44 169.07 31.26L163.6 25.93L169.07 20.59C169.25 20.41 169.35 20.17 169.35 19.92C169.35 19.4 168.94 19 168.42 19C168.17 19 167.95 19.09 167.78 19.26L161.7 25.2C161.48 25.4 161.37 25.65 161.37 25.93C161.37 26.2 161.48 26.43 161.69 26.64L167.77 32.59C167.95 32.76 168.17 32.86 168.42 32.86Z" fill="white" transform="scale(-1,1) translate(-330,0)" />
                        </g>
                    )}
                </g>
            </svg>
        </div >
    )
}

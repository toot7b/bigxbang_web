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
                    borderRadius: "0 0 11px 11px", // Matches frame clip
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
                        d="M0 52H1202V741C1202 747.627 1196.63 753 1190 753H12C5.37258 753 0 747.627 0 741V52Z"
                        fill="none"
                        stroke="rgba(48, 110, 232, 0.38)"
                        strokeWidth="2"
                    />

                    {/* Header Bar - Slightly Lighter Overlay for contrast */}
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 12C0 5.37258 5.37258 0 12 0H1190C1196.63 0 1202 5.37258 1202 12V52H0L0 12Z"
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
                            x="585"
                            y="30"
                            fill="white"
                            fontSize="12"
                            fontFamily="Arial, sans-serif"
                            opacity="0.9"
                        >
                            {url}
                        </text>

                        {/* Refresh Icon */}
                        <path
                            d="M936.273 24.9766C936.5 24.9766 936.68 24.9062 936.82 24.7578L940.023 21.5312C940.195 21.3594 940.273 21.1719 940.273 20.9531C940.273 20.7422 940.188 20.5391 940.023 20.3828L936.82 17.125C936.68 16.9688 936.5 16.8906 936.273 16.8906C935.852 16.8906 935.516 17.2422 935.516 17.6719C935.516 17.8828 935.594 18.0547 935.727 18.2031L937.594 20.0312C937.227 19.9766 936.852 19.9453 936.477 19.9453C932.609 19.9453 929.516 23.0391 929.516 26.9141C929.516 30.7891 932.633 33.9062 936.5 33.9062C940.375 33.9062 943.484 30.7891 943.484 26.9141C943.484 26.4453 943.156 26.1094 942.688 26.1094C942.234 26.1094 941.93 26.4453 941.93 26.9141C941.93 29.9297 939.516 32.3516 936.5 32.3516C933.492 32.3516 931.07 29.9297 931.07 26.9141C931.07 23.875 933.469 21.4688 936.477 21.4688C936.984 21.4688 937.453 21.5078 937.867 21.5781L935.734 23.6875C935.594 23.8281 935.516 24 935.516 24.2109C935.516 24.6406 935.852 24.9766 936.273 24.9766Z"
                            fill="white"
                        />

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
        </div>
    )
}

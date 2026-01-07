export default function Logo({ className }: { className?: string }) {
    return (
        <img
            src="/logo.svg"
            alt="BigxBang Logo"
            className={className}
        />
    );
}

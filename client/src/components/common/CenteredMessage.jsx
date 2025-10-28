export default function CenteredMessage({ children, color = "gray" }) {
    const colorClass = color === "red" ? "text-red-400" : "text-gray-400";
    return (
        <section className="flex-1 p-3 flex items-center justify-center">
            <div className={colorClass}>{children}</div>
        </section>
    );
}
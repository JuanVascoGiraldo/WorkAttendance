import { theme } from "../../theme";

function Loading({ label = "Cargando...", size = 18, align = "center" }) {
  const justifyContent = align === "left" ? "flex-start" : "center";

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent,
        gap: "8px",
        color: theme.color2,
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden="true">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={theme.color3}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <span>{label}</span>
    </div>
  );
}

export default Loading;
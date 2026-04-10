import { cardStyle, theme } from "../../theme";

function NotFoundPage({ onGoHome }) {
  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0, color: theme.color2 }}>404</h2>
      <p style={{ margin: "0 0 12px", color: theme.color2 }}>
        La pagina que buscas no existe.
      </p>
      <button
        type="button"
        onClick={() => onGoHome && onGoHome()}
        style={{
          backgroundColor: theme.color2,
          color: theme.color5,
          border: "none",
          borderRadius: theme.radiusSm,
          padding: "10px 14px",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        Volver al inicio
      </button>
    </section>
  );
}

export default NotFoundPage;
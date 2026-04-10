import { useState } from "react";
import { buttonPrimaryStyle, cardStyle, theme } from "../theme";
import { checkTypeOptions } from "../../configuration";

function Check({ onSubmit, loading = false, defaultType = checkTypeOptions[0].value }) {
  const [type, setType] = useState(defaultType);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit({ type });
    }
  };

  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0, color: theme.color2 }}>Check</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
        <label style={{ display: "grid", gap: "6px" }}>
          <span>Tipo</span>
          <select value={type} onChange={(e) => setType(Number(e.target.value))} style={selectStyle}>
            {checkTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" style={buttonPrimaryStyle} disabled={loading}>
          {loading ? "Procesando..." : "Registrar"}
        </button>
      </form>
    </section>
  );
}

const selectStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: theme.radiusSm,
  border: `1px solid ${theme.color4}`,
  fontSize: "14px",
  boxSizing: "border-box",
};

export default Check;

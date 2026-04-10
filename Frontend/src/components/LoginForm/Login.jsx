import { useState } from "react";
import { buttonPrimaryStyle, cardStyle, inputStyle, theme } from "../theme";

function Login({ onSubmit, loading = false, defaultValues }) {
  const [form, setForm] = useState({
    email: defaultValues?.email || "",
    employee_number: defaultValues?.employee_number || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(form);
    }
  };

  return (
    <section style={loginCardStyle}>
      <h2 style={{ marginTop: 0, color: theme.color2 }}>Login</h2>
      <p style={{ margin: "-2px 0 10px", color: "#607895" }}>Accede con tu correo y numero de empleado.</p>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
        <label style={{ display: "grid", gap: "6px" }}>
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="correo@empresa.com"
            style={inputStyle}
            required
          />
        </label>

        <label style={{ display: "grid", gap: "6px" }}>
          <span>Numero de empleado</span>
          <input
            type="text"
            name="employee_number"
            value={form.employee_number}
            onChange={handleChange}
            placeholder="EMP-001"
            style={inputStyle}
            required
          />
        </label>

        <button type="submit" style={buttonPrimaryStyle} disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesion"}
        </button>
      </form>
    </section>
  );
}

const loginCardStyle = {
  ...cardStyle,
  width: "min(520px, 92vw)",
};

export default Login;

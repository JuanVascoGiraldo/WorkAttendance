import { useEffect, useState } from "react";
import { ROLE, areaOptions, roleOptions, translateRole } from "../../configuration";
import { buttonPrimaryStyle, cardStyle, inputStyle, theme } from "../theme";

const buildFormState = (defaultValues = {}) => ({
  first_name: defaultValues.first_name || "",
  last_name: defaultValues.last_name || "",
  email: defaultValues.email || "",
  employee_number: defaultValues.employee_number || "",
  role: defaultValues.role ? String(defaultValues.role) : String(roleOptions[0].value),
  areas: (defaultValues.areas || (defaultValues.area ? [defaultValues.area] : [])).map((item) => String(item)),
  supervisor_id: defaultValues.supervisor_id || "",
  is_active: defaultValues.is_active ?? true,
});

function UserForm({
  title,
  submitLabel,
  defaultValues,
  supervisors = [],
  loading = false,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(() => buildFormState(defaultValues));
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setForm(buildFormState(defaultValues));
  }, [defaultValues]);

  useEffect(() => {
    if (Number(form.role) !== ROLE.USER) {
      if (form.supervisor_id) {
        setForm((prev) => ({ ...prev, supervisor_id: "" }));
      }
      return;
    }

    if (!form.supervisor_id && supervisors.length > 0) {
      setForm((prev) => ({ ...prev, supervisor_id: String(supervisors[0].id) }));
    }
  }, [form.role, form.supervisor_id, supervisors]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAreaChange = (event) => {
    const { value, checked } = event.target;
    setForm((prev) => {
      const nextAreas = checked
        ? [...prev.areas, value]
        : prev.areas.filter((item) => item !== value);

      return {
        ...prev,
        areas: nextAreas,
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!onSubmit) {
      return;
    }

    if (form.areas.length === 0) {
      setFormError("Debes seleccionar al menos un area.");
      return;
    }

    setFormError("");

    onSubmit({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      employee_number: form.employee_number.trim(),
      role: Number(form.role),
      areas: form.areas.map((item) => Number(item)),
      supervisor_id: Number(form.role) === ROLE.USER ? form.supervisor_id.trim() || undefined : undefined,
      is_active: form.is_active,
    });
  };

  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0, color: theme.color2 }}>{title}</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
        <div style={gridTwoColumns}>
          <label style={fieldStyle}>
            <span>Nombre</span>
            <input name="first_name" value={form.first_name} onChange={handleChange} style={inputStyle} required />
          </label>
          <label style={fieldStyle}>
            <span>Apellido</span>
            <input name="last_name" value={form.last_name} onChange={handleChange} style={inputStyle} required />
          </label>
        </div>

        <div style={gridTwoColumns}>
          <label style={fieldStyle}>
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} required />
          </label>
          <label style={fieldStyle}>
            <span>Numero de empleado</span>
            <input name="employee_number" value={form.employee_number} onChange={handleChange} style={inputStyle} required />
          </label>
        </div>

        <div style={gridTwoColumns}>
          <label style={fieldStyle}>
            <span>Rol</span>
            <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div style={fieldStyle}>
            <span>Areas</span>
            <div style={areasWrapperStyle}>
              {areaOptions.map((option) => {
                const optionValue = String(option.value);
                const isChecked = form.areas.includes(optionValue);

                return (
                  <label key={option.value} style={areaOptionStyle}>
                    <input
                      type="checkbox"
                      value={optionValue}
                      checked={isChecked}
                      onChange={handleAreaChange}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
            {formError ? <small style={formErrorStyle}>{formError}</small> : null}
          </div>
        </div>

        {Number(form.role) === ROLE.USER && supervisors.length > 0 ? (
          <label style={fieldStyle}>
            <span>Supervisor asignado</span>
            <select name="supervisor_id" value={form.supervisor_id} onChange={handleChange} style={inputStyle} required>
              {supervisors.map((supervisor) => {
                const fullName = `${supervisor.first_name || ""} ${supervisor.last_name || ""}`.trim();
                return (
                  <option key={supervisor.id} value={String(supervisor.id)}>
                    {fullName || translateRole(supervisor.role)}
                  </option>
                );
              })}
            </select>
          </label>
        ) : Number(form.role) === ROLE.USER ? (
          <label style={fieldStyle}>
            <span>Supervisor asignado</span>
            <input
              name="supervisor_id"
              value={form.supervisor_id}
              onChange={handleChange}
              style={inputStyle}
              placeholder="No hay supervisores disponibles"
              disabled
            />
          </label>
        ) : null}

        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} />
          <span>Usuario activo</span>
        </label>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button type="submit" style={buttonPrimaryStyle} disabled={loading}>
            {loading ? `${submitLabel}...` : submitLabel}
          </button>
          {onCancel ? (
            <button type="button" onClick={onCancel} style={secondaryButtonStyle} disabled={loading}>
              Cancelar
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

const gridTwoColumns = {
  display: "grid",
  gap: "12px",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const fieldStyle = {
  display: "grid",
  gap: "6px",
};

const areasWrapperStyle = {
  display: "grid",
  gap: "6px",
  border: `1px solid ${theme.color4}`,
  borderRadius: theme.radiusSm,
  padding: "10px",
  backgroundColor: "rgba(255,255,255,0.8)",
};

const areaOptionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const formErrorStyle = {
  color: "#b42318",
  fontWeight: 600,
};

const secondaryButtonStyle = {
  backgroundColor: theme.color4,
  color: theme.color2,
  border: "none",
  borderRadius: theme.radiusSm,
  padding: "10px 14px",
  fontWeight: 700,
  cursor: "pointer",
};

export default UserForm;
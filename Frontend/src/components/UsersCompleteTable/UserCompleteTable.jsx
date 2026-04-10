import { cardStyle, theme } from "../theme";
import { translateAreas, translateRole } from "../../configuration";

function UserCompleteTable({ users = [], onSelectUser, loading = false }) {
  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0, color: theme.color2 }}>Usuarios</h2>
      <div style={{ overflowX: "auto", borderRadius: theme.radiusSm }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: theme.color4 }}>
              <th style={thStyle}>Nombre completo</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Rol</th>
              <th style={thStyle}>Areas</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Accion</th>
            </tr>
          </thead>
          <tbody>
            {!loading && users.length === 0 ? (
              <tr>
                <td style={loadingCellStyle} colSpan={6}>
                  Sin usuarios para mostrar.
                </td>
              </tr>
            ) : null}
            {users.map((user) => (
              <tr key={user.id}>
                <td style={tdStyle}>{`${user.first_name} ${user.last_name}`}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{translateRole(user.role)}</td>
                <td style={tdStyle}>{translateAreas(user.areas)}</td>
                <td style={tdStyle}>{user.is_active ? "Activo" : "Inactivo"}</td>
                <td style={tdStyle}>
                  <button
                    type="button"
                    onClick={() => onSelectUser && onSelectUser(user)}
                    style={buttonRowStyle}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const loadingCellStyle = {
  padding: "10px",
  borderBottom: `1px solid ${theme.color4}`,
  textAlign: "center",
  color: theme.color2,
  fontWeight: 600,
};

const thStyle = {
  textAlign: "left",
  padding: "10px",
  borderBottom: `1px solid ${theme.color4}`,
  color: theme.color2,
};

const tdStyle = {
  padding: "10px",
  borderBottom: `1px solid ${theme.color4}`,
};

const buttonRowStyle = {
  backgroundColor: theme.color2,
  color: theme.color5,
  border: "none",
  borderRadius: theme.radiusSm,
  padding: "8px 10px",
  cursor: "pointer",
};

export default UserCompleteTable;

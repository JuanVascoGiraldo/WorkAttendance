import { useEffect, useState } from "react";
import { ErrorHandler } from "../../ui";
import Loading from "../ui";
import { cardStyle, theme } from "../../theme";
import { ATTENDANCE_STATUS, translateAreas, translateAttendanceStatus } from "../../../configuration";
import { useActions } from "../../../reducers/utils";

function SupervisorPage({ user }) {
  const actions = useActions();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = async (selectedDate = date) => {
    if (!user?.id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await actions.getBySupervisorAndDate(user.id, selectedDate);
      setUsers(response?.users || []);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [user?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loadUsers(date);
  };

  if (!user) {
    return (
      <section style={cardStyle}>
        <h2 style={{ marginTop: 0, color: theme.color2 }}>Supervisor</h2>
        <p style={{ margin: 0 }}>No hay supervisor activo.</p>
      </section>
    );
  }

  return (
    <section style={pageStyle}>
      <header style={headerStyle}>
        <h1 style={{ margin: 0, color: theme.color2 }}>Supervisor</h1>
        <p style={{ margin: 0, color: "#58708f" }}>Consulta el estado por fecha de tus usuarios asignados.</p>
      </header>

      <form onSubmit={handleSubmit} style={filterStyle}>
        <label style={fieldStyle}>
          <span>Fecha</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} style={dateStyle} />
        </label>
        <button type="submit" style={buttonStyle}>
          Consultar
        </button>
      </form>

      {loading ? <Loading label="Cargando status" /> : null}

      {!loading ? (
        <section style={tableCardStyle}>
          <h2 style={{ marginTop: 0, color: theme.color2 }}>Usuarios asignados</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: theme.color4 }}>
                  <th style={thStyle}>Nombre completo</th>
                  <th style={thStyle}>Areas</th>
                  <th style={thStyle}>Numero</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Horas</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td style={emptyCellStyle} colSpan={5}>
                      Sin resultados para la fecha seleccionada.
                    </td>
                  </tr>
                ) : (
                  users.map((item) => (
                    <tr key={item.id}>
                      <td style={tdStyle}>{item.full_name}</td>
                      <td style={tdStyle}>{translateAreas(item.areas)}</td>
                      <td style={tdStyle}>{item.employee_number}</td>
                      <td style={tdStyle}>
                        <span style={{ ...statusPillStyle, ...getAttendanceStatusStyle(item.attendance_status) }}>
                          {translateAttendanceStatus(item.attendance_status)}
                        </span>
                      </td>
                      <td style={tdStyle}>{item.work_hours}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <ErrorHandler error={error} onRetry={() => loadUsers(date)} />
    </section>
  );
}

const pageStyle = {
  display: "grid",
  gap: "18px",
};

const headerStyle = {
  display: "grid",
  gap: "6px",
  padding: "14px 16px",
  border: `1px solid ${theme.color4}`,
  borderRadius: theme.radiusMd,
  backgroundColor: "rgba(255,255,255,0.72)",
};

const filterStyle = {
  display: "flex",
  gap: "10px",
  alignItems: "end",
  flexWrap: "wrap",
  padding: "14px 16px",
  borderRadius: theme.radiusMd,
  backgroundColor: "rgba(255,255,255,0.8)",
  border: `1px solid ${theme.color4}`,
};

const fieldStyle = {
  display: "grid",
  gap: "6px",
};

const dateStyle = {
  padding: "10px 12px",
  borderRadius: theme.radiusSm,
  border: `1px solid ${theme.color4}`,
};

const buttonStyle = {
  backgroundColor: theme.color3,
  color: theme.color5,
  border: "none",
  borderRadius: theme.radiusSm,
  padding: "10px 14px",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 8px 16px rgba(231,111,81,0.25)",
};

const tableCardStyle = {
  ...cardStyle,
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

const statusPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "999px",
  padding: "4px 10px",
  fontWeight: 700,
  fontSize: "12px",
};

const getAttendanceStatusStyle = (status) => {
  switch (status) {
    case ATTENDANCE_STATUS.COMPLETE:
      return {
        backgroundColor: "#d1fae5",
        color: "#065f46",
      };
    case ATTENDANCE_STATUS.OPEN:
      return {
        backgroundColor: "#dbeafe",
        color: "#1e40af",
      };
    case ATTENDANCE_STATUS.LATE:
      return {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      };
    default:
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      };
  }
};

const emptyCellStyle = {
  ...tdStyle,
  textAlign: "center",
};

export default SupervisorPage;
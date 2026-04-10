import { cardStyle, theme } from "../theme";
import {
  ATTENDANCE_STATUS,
  translateAreas,
  translateAttendanceStatus,
  translateRole,
} from "../../configuration";

function UserInfo({ user, onEdit, loading = false, canEdit = true }) {
  if (!user) {
    return (
      <section style={cardStyle}>
        <h2 style={{ marginTop: 0, color: theme.color2 }}>Informacion del usuario</h2>
        <p style={{ color: theme.color2 }}>Selecciona un usuario para ver su informacion.</p>
      </section>
    );
  }

  const statusStyle = getAttendanceStatusStyle(user.attendance_status);

  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0, color: theme.color2 }}>Informacion del usuario</h2>
      <div style={{ display: "grid", gap: "6px" }}>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Nombre:</strong> {user.first_name} {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Numero:</strong> {user.employee_number}</p>
        <p><strong>Rol:</strong> {translateRole(user.role)}</p>
        <p><strong>Areas:</strong> {translateAreas(user.areas)}</p>
        <p><strong>Estado:</strong> {user.is_active ? "Activo" : "Inactivo"}</p>
        <p>
          <strong>Asistencia:</strong>{" "}
          <span style={{ ...attendancePillStyle, ...statusStyle }}>
            {translateAttendanceStatus(user.attendance_status)}
          </span>
        </p>
        <p><strong>Horas trabajadas:</strong> {user.work_hours}</p>
        <p><strong>Creado:</strong> {formatDate(user.created_at)}</p>
        <p><strong>Actualizado:</strong> {formatDate(user.updated_at)}</p>
      </div>

      {canEdit && onEdit ? (
        <button type="button" onClick={() => onEdit(user)} style={editButtonStyle}>
          Editar
        </button>
      ) : null}
    </section>
  );
}

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

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleString();
};

const attendancePillStyle = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "999px",
  padding: "4px 10px",
  fontWeight: 700,
  fontSize: "12px",
};

const editButtonStyle = {
  marginTop: "12px",
  backgroundColor: theme.color2,
  color: theme.color5,
  border: "none",
  borderRadius: theme.radiusSm,
  padding: "10px 14px",
  fontWeight: 700,
  cursor: "pointer",
};

export default UserInfo;

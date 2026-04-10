const ROLE = {
  USER: 1,
  SUPERVISOR: 2,
  ADMIN: 3,
};

const ATTENDANCE_STATUS = {
  COMPLETE: 1,
  OPEN: 2,
  LATE: 3,
  ABSENT: 4,
};

const CHECK_TYPE = {
  IN: 1,
  OUT: 2,
};

const AREA = {
  OPERATIONS: 1,
  LOGISTICS: 2,
  HR: 3,
  FINANCE: 4,
  IT: 5,
};

const roleText = {
  [ROLE.USER]: "Usuario",
  [ROLE.SUPERVISOR]: "Supervisor",
  [ROLE.ADMIN]: "Administrador",
};

const attendanceStatusText = {
  [ATTENDANCE_STATUS.COMPLETE]: "Completo",
  [ATTENDANCE_STATUS.OPEN]: "Abierto",
  [ATTENDANCE_STATUS.LATE]: "Retardo",
  [ATTENDANCE_STATUS.ABSENT]: "Ausente",
};

const checkTypeText = {
  [CHECK_TYPE.IN]: "Entrada",
  [CHECK_TYPE.OUT]: "Salida",
};

const areaText = {
  [AREA.OPERATIONS]: "Operaciones",
  [AREA.LOGISTICS]: "Logistica",
  [AREA.HR]: "Recursos Humanos",
  [AREA.FINANCE]: "Finanzas",
  [AREA.IT]: "TI",
};

export const translateRole = (value) => roleText[value] || String(value || "-");

export const translateAttendanceStatus = (value) =>
  attendanceStatusText[value] || String(value || "-");

export const translateCheckType = (value) =>
  checkTypeText[value] || String(value || "-");

export const translateArea = (value) => areaText[value] || String(value || "-");

export const translateAreas = (values = []) => {
  if (!Array.isArray(values) || values.length === 0) {
    return "-";
  }

  return values.map((item) => translateArea(item)).join(", ");
};

export const roleOptions = [
  { value: ROLE.USER, label: roleText[ROLE.USER] },
  { value: ROLE.SUPERVISOR, label: roleText[ROLE.SUPERVISOR] },
  { value: ROLE.ADMIN, label: roleText[ROLE.ADMIN] },
];

export const checkTypeOptions = [
  { value: CHECK_TYPE.IN, label: checkTypeText[CHECK_TYPE.IN] },
  { value: CHECK_TYPE.OUT, label: checkTypeText[CHECK_TYPE.OUT] },
];

export const areaOptions = [
  { value: AREA.OPERATIONS, label: areaText[AREA.OPERATIONS] },
  { value: AREA.LOGISTICS, label: areaText[AREA.LOGISTICS] },
  { value: AREA.HR, label: areaText[AREA.HR] },
  { value: AREA.FINANCE, label: areaText[AREA.FINANCE] },
  { value: AREA.IT, label: areaText[AREA.IT] },
];

export { AREA, ATTENDANCE_STATUS, CHECK_TYPE, ROLE };
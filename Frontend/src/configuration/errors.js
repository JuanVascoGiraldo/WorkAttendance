export const COMMON_ERROR_DICTIONARY = {
  user_not_found: {
    title: "Usuario no encontrado",
    description: "El usuario solicitado no existe.",
  },
  email_already_exists: {
    title: "Correo ya registrado",
    description: "Ya existe una cuenta con este correo.",
  },
  employee_number_already_exists: {
    title: "Numero de empleado duplicado",
    description: "Ese numero de empleado ya esta registrado.",
  },
  invalid_employee_number: {
    title: "Credenciales invalidas",
    description: "El numero de empleado no coincide con el correo.",
  },
  check_out_without_check_in: {
    title: "Salida invalida",
    description: "No se puede registrar salida sin una entrada previa.",
  },
  check_out_before_check_in: {
    title: "Horario invalido",
    description: "La hora de salida no puede ser menor a la de entrada.",
  },
  validation_error: {
    title: "Datos invalidos",
    description: "Revisa los campos del formulario e intenta de nuevo.",
  },
};

const STATUS_FALLBACK = {
  400: {
    title: "Solicitud invalida",
    description: "No fue posible procesar la solicitud.",
  },
  401: {
    title: "No autorizado",
    description: "Tus credenciales no son validas.",
  },
  403: {
    title: "Acceso denegado",
    description: "No tienes permisos para esta accion.",
  },
  404: {
    title: "No encontrado",
    description: "El recurso solicitado no existe.",
  },
  409: {
    title: "Conflicto",
    description: "La operacion entra en conflicto con el estado actual.",
  },
  422: {
    title: "Datos invalidos",
    description: "Los datos enviados no son validos.",
  },
  500: {
    title: "Error interno",
    description: "Ocurrio un error inesperado en el servidor.",
  },
};

const DEFAULT_ERROR = {
  title: "Error",
  description: "No fue posible completar la operacion.",
};

export const resolveAppError = (error) => {
  const payload = error?.payload || {};
  const name = payload?.name;

  if (name && COMMON_ERROR_DICTIONARY[name]) {
    return {
      ...COMMON_ERROR_DICTIONARY[name],
      code: name,
      raw: payload,
    };
  }

  const status = error?.status;
  if (status && STATUS_FALLBACK[status]) {
    const fallback = STATUS_FALLBACK[status];
    return {
      title: fallback.title,
      description: payload?.message || payload?.detail || fallback.description,
      code: String(status),
      raw: payload,
    };
  }

  return {
    title: DEFAULT_ERROR.title,
    description: error?.message || DEFAULT_ERROR.description,
    code: "unknown",
    raw: payload,
  };
};

export default resolveAppError;
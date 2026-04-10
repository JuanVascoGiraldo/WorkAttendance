import Login from "../../components/LoginForm";
import { useState } from "react";
import { DEFAULT_TOAST_TIME } from "../../configuration";
import Loading from "../../components/pages/ui";
import { toaster } from "../../components/ui/Toaster";
import ErrorHandler, { useHttpError } from "../../components/ui/ErrorHandler";
import { useActions } from "../../reducers/utils/Redux";
import { trackEvent } from "../../configuration/amplitude";
import { theme } from "../../components/theme";

function LoginPage({ onSuccess }) {
  const actions = useActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleHttpCall } = useHttpError();
  
  const onSubmit = async (form) => {
    setLoading(true);
    setError(null);
    const { email, employee_number } = form;
    trackEvent("login_submit", { source: "login_page" });
    await handleHttpCall(actions.login, { email, employee_number }, {
      onSuccess: ({ status, data }) => {
        const userId = data?.user_id;
        if (userId) {
          sessionStorage.setItem("session_user_id", String(userId));
        }
        trackEvent("login_success", { source: "login_page", status });
        toaster.create({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido",
          status: "success",
          duration: DEFAULT_TOAST_TIME,
          isClosable: true,
        });
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError: ({ status, data }) => {
        trackEvent("login_error", {
          source: "login_page",
          status,
          error: data?.name || data?.error_code,
        });
        setError({ status, payload: data, message: "No fue posible iniciar sesion" });
        setLoading(false);
      },
    });

    setLoading(false);
  };

  return (
    <section style={pageStyle}>
      <section style={heroStyle}>
        <p style={eyebrowStyle}>Bienvenido</p>
        <h2 style={titleStyle}>Inicia sesion para ver tu panel</h2>
        <p style={descriptionStyle}>
          Consulta tu informacion, registra asistencia y administra usuarios segun tu rol.
        </p>
      </section>
      {loading && <Loading />}
      <Login onSubmit={onSubmit} loading={loading} />
      <ErrorHandler error={error} onRetry={() => setError(null)} />
    </section>
  );
}

const pageStyle = {
  minHeight: "calc(100vh - 150px)",
  display: "grid",
  alignContent: "center",
  justifyItems: "center",
  gap: "14px",
};

const heroStyle = {
  textAlign: "center",
  maxWidth: "620px",
  padding: "8px 12px",
};

const eyebrowStyle = {
  margin: 0,
  color: theme.color3,
  fontWeight: 700,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  fontSize: "12px",
};

const titleStyle = {
  margin: "8px 0",
  color: theme.color2,
  fontSize: "32px",
  lineHeight: 1.12,
};

const descriptionStyle = {
  margin: 0,
  color: "#4d6380",
};

export default LoginPage;

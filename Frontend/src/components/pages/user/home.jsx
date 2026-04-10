import { useState } from "react";
import Check from "../../CheckForm";
import UserInfo from "../../UserInfoCard";
import { ErrorHandler } from "../../ui";
import Loading from "../ui";
import { useActions } from "../../../reducers/utils";
import { theme } from "../../theme";

function UserHomePage({ user, onUserChanged }) {
  const actions = useActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheck = async (payload) => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await actions.check(user.id, payload);
      if (onUserChanged) {
        onUserChanged(response);
      }
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <section style={emptyStateStyle}>
        <h2 style={{ marginTop: 0 }}>Usuario no disponible</h2>
        <p style={{ margin: 0 }}>No se encontro la sesion activa.</p>
      </section>
    );
  }

  return (
    <section style={pageStyle}>
      <header style={headerStyle}>
        <h1 style={{ margin: 0, color: theme.color2 }}>Mi informacion</h1>
        <p style={{ margin: 0, color: "#58708f" }}>
          Visualiza tus datos y registra entrada o salida del dia.
        </p>
      </header>
      {loading ? <Loading label="Registrando check" /> : null}
      <div style={gridStyle}>
        <UserInfo user={user} canEdit={false} />
        <Check onSubmit={handleCheck} />
      </div>
      <ErrorHandler error={error} onRetry={() => setError(null)} />
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

const gridStyle = {
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
};

const emptyStateStyle = {
  padding: "24px",
  borderRadius: theme.radiusMd,
  backgroundColor: "rgba(255,255,255,0.82)",
  border: `1px solid ${theme.color4}`,
};

export default UserHomePage;
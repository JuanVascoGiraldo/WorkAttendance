import { useState } from "react";
import Login from "../../LoginForm";
import Loading from "../ui";
import { ErrorHandler } from "../../ui";
import { useActions } from "../../../reducers/utils";

function LoginPage({ onSuccess }) {
  const actions = useActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (dataSubmit) => {
    setLoading(true);
    setError(null);

    try {
      const payload = await actions.login(dataSubmit);
      if (onSuccess) {
        onSuccess(payload);
      }
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading label="Iniciando sesion" />;
  }

  return (
    <section style={{ display: "grid", gap: "12px" }}>
      <Login onSubmit={onSubmit} />
      <ErrorHandler error={error} onRetry={() => setError(null)} />
    </section>
  );
}

export default LoginPage;
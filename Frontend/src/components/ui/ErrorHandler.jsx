import { resolveAppError } from "../../configuration/errors";
import { buttonPrimaryStyle, theme } from "../theme";

export const useHttpError = () => {
  const handleHttpCall = async (action, ...args) => {
    const optionsCandidate = args.at(-1);
    const hasCallbacks = optionsCandidate && typeof optionsCandidate === "object" && (optionsCandidate.onSuccess || optionsCandidate.onError);
    const options = hasCallbacks ? optionsCandidate : {};
    const callArgs = hasCallbacks ? args.slice(0, -1) : args;

    try {
      const data = await action(...callArgs);
      const response = { status: 200, data };
      if (options.onSuccess) {
        options.onSuccess(response);
      }
      return response;
    } catch (error) {
      const response = {
        status: error?.status || 500,
        data: error?.payload || null,
        error,
      };
      if (options.onError) {
        options.onError(response);
      }
      return response;
    }
  };

  return { handleHttpCall };
};

function ErrorHandler({ error, onRetry, align = "left" }) {
  if (!error) {
    return null;
  }

  const resolved = resolveAppError(error);
  const textAlign = align === "center" ? "center" : "left";

  return (
    <section
      role="alert"
      aria-live="assertive"
      style={{
        border: `1px solid ${theme.color3}`,
        borderRadius: theme.radiusSm,
        backgroundColor: theme.color5,
        padding: "12px",
        display: "grid",
        gap: "8px",
        textAlign,
      }}
    >
      <strong style={{ color: theme.color2 }}>{resolved.title}</strong>
      <p style={{ margin: 0, color: theme.color2 }}>{resolved.description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          style={{ ...buttonPrimaryStyle, width: "fit-content" }}
        >
          Reintentar
        </button>
      ) : null}
    </section>
  );
}

export default ErrorHandler;
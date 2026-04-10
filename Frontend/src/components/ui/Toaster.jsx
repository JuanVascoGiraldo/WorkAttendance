import { useEffect, useState } from "react";
import { theme } from "../theme";

let nextToastId = 1;
const listeners = new Set();
let toastItems = [];

const notify = () => {
  for (const listener of listeners) {
    listener(toastItems);
  }
};

const removeToast = (toastId) => {
  toastItems = toastItems.filter((toast) => toast.id !== toastId);
  notify();
};

export const toaster = {
  create: ({ title, description, status = "info", duration = 3000, isClosable = true } = {}) => {
    const id = nextToastId++;
    const toast = { id, title, description, status, isClosable };

    toastItems = [...toastItems, toast];
    notify();

    if (duration > 0) {
      window.setTimeout(() => removeToast(id), duration);
    }

    return id;
  },
  dismiss: removeToast,
  clear: () => {
    toastItems = [];
    notify();
  },
};

const getStatusStyle = (status) => {
  switch (status) {
    case "success":
      return { borderColor: "#2f855a", accentColor: "#2f855a" };
    case "error":
      return { borderColor: "#c53030", accentColor: "#c53030" };
    case "warning":
      return { borderColor: "#b7791f", accentColor: "#b7791f" };
    default:
      return { borderColor: theme.color2, accentColor: theme.color2 };
  }
};

function Toaster() {
  const [items, setItems] = useState(toastItems);

  useEffect(() => {
    const listener = (nextItems) => setItems(nextItems);
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        display: "grid",
        gap: "12px",
        zIndex: 9999,
        width: "min(360px, calc(100vw - 32px))",
      }}
    >
      {items.map((toast) => {
        const style = getStatusStyle(toast.status);

        return (
          <article
            key={toast.id}
            style={{
              backgroundColor: theme.color5,
              border: `1px solid ${style.borderColor}`,
              borderLeft: `6px solid ${style.accentColor}`,
              borderRadius: theme.radiusMd,
              padding: "14px 16px",
              boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
              display: "grid",
              gap: "6px",
            }}
          >
            <strong style={{ color: theme.color2 }}>{toast.title}</strong>
            {toast.description ? <p style={{ margin: 0, color: theme.color2 }}>{toast.description}</p> : null}
            {toast.isClosable ? (
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                style={{
                  justifySelf: "end",
                  backgroundColor: "transparent",
                  border: "none",
                  color: style.accentColor,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Cerrar
              </button>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export default Toaster;
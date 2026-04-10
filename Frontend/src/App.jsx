import { useEffect, useState } from "react";
import { ROLE } from "./configuration";
import { translateAttendanceStatus } from "./configuration";
import {
  AdminPage,
  NotFoundPage,
  SupervisorPage,
  UserHomePage,
} from "./components/pages";
import LoginPage from "./app/login/page";
import { useActions } from "./reducers/utils";
import { Toaster } from "./components/ui";
import { theme } from "./components/theme";

const ROLE_VIEWS = {
  [ROLE.USER]: "user",
  [ROLE.SUPERVISOR]: "supervisor",
  [ROLE.ADMIN]: "admin",
};

const SESSION_USER_ID_KEY = "session_user_id";
const SESSION_USER_DATA_KEY = "session_user_data";
const getViewByRole = (role) => ROLE_VIEWS[role] || "user";
const normalizeUserPayload = (payload) => payload?.user || payload?.data?.user || payload;

function App() {
  const actions = useActions();
  const [currentView, setCurrentView] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [restoringSession, setRestoringSession] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      if (currentView === "admin") {
        document.title = "Attendance | Admin";
        return;
      }

      if (currentView === "supervisor") {
        document.title = "Attendance | Supervisor";
        return;
      }

      document.title = "Attendance";
      return;
    }

    const fullName = `${currentUser.first_name || ""} ${currentUser.last_name || ""}`.trim();
    const statusText = translateAttendanceStatus(currentUser.attendance_status);
    const employeeNumber = currentUser.employee_number ? `#${currentUser.employee_number}` : "";
    const pieces = ["Attendance", fullName, employeeNumber, statusText].filter(Boolean);
    document.title = pieces.join(" | ");
  }, [currentView, currentUser]);

  useEffect(() => {
    const restoreSession = async () => {
      const savedUserJson = sessionStorage.getItem(SESSION_USER_DATA_KEY);

      if (savedUserJson) {
        try {
          const savedUser = JSON.parse(savedUserJson);
          setCurrentUser(savedUser);
          setCurrentView(getViewByRole(savedUser.role));
          setRestoringSession(false);
          return;
        } catch {
          sessionStorage.removeItem(SESSION_USER_DATA_KEY);
        }
      }

      const savedUserId = sessionStorage.getItem(SESSION_USER_ID_KEY);

      if (!savedUserId) {
        setRestoringSession(false);
        return;
      }

      try {
        const response = await actions.getById(savedUserId);
        const user = normalizeUserPayload(response);
        sessionStorage.setItem(SESSION_USER_DATA_KEY, JSON.stringify(user));
        setCurrentUser(user);
        setCurrentView(getViewByRole(user.role));
      } catch {
        sessionStorage.removeItem(SESSION_USER_ID_KEY);
        sessionStorage.removeItem(SESSION_USER_DATA_KEY);
        setCurrentView("login");
      } finally {
        setRestoringSession(false);
      }
    };

    restoreSession();
  }, [actions]);

  const handleLoginSuccess = async (payload) => {
    const userId = payload?.user_id || payload?.data?.user_id;
    if (!userId) {
      return;
    }

    sessionStorage.setItem(SESSION_USER_ID_KEY, String(userId));

    const response = await actions.getById(userId);
    const user = normalizeUserPayload(response);
    sessionStorage.setItem(SESSION_USER_DATA_KEY, JSON.stringify(user));
    setCurrentUser(user);
    setCurrentView(getViewByRole(user.role));
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_USER_ID_KEY);
    sessionStorage.removeItem(SESSION_USER_DATA_KEY);
    setCurrentUser(null);
    setCurrentView("login");
  };

  const renderView = () => {
    switch (currentView) {
      case "login":
        return <LoginPage onSuccess={handleLoginSuccess} />;
      case "user":
        return <UserHomePage user={currentUser} />;
      case "admin":
        return <AdminPage />;
      case "supervisor":
        return <SupervisorPage user={currentUser} />;
      case "404":
        return <NotFoundPage onGoHome={() => setCurrentView("login")} />;
      default:
        return <NotFoundPage onGoHome={() => setCurrentView("login")} />;
    }
  };

  return (
    <main style={layoutStyle}>
      <Toaster />
      <header style={headerStyle}>
        <div style={{ display: "grid", gap: "6px" }}>
          <h1 style={titleStyle}>WorkAttendance</h1>
          <p style={subtitleStyle}>Gestion de asistencia por rol</p>
        </div>
        {currentUser ? (
          <button type="button" onClick={handleLogout} style={logoutButtonStyle}>
            Cerrar sesion
          </button>
        ) : null}
      </header>

      {restoringSession ? null : renderView()}
    </main>
  );
}

const layoutStyle = {
  minHeight: "100vh",
  padding: "28px",
  display: "grid",
  gap: "20px",
  background: "radial-gradient(circle at 0% 0%, #f7d7ce 0%, #f5f8fc 40%, #edf2f7 100%)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
  padding: "12px 16px",
  borderRadius: "16px",
  backgroundColor: "rgba(255,255,255,0.75)",
  border: `1px solid ${theme.color4}`,
};

const titleStyle = {
  margin: 0,
  color: theme.color2,
  letterSpacing: "0.3px",
};

const subtitleStyle = {
  margin: 0,
  color: "#516b8b",
};

const logoutButtonStyle = {
  border: "none",
  borderRadius: "10px",
  padding: "10px 14px",
  cursor: "pointer",
  backgroundColor: theme.color2,
  color: "#ffffff",
  fontWeight: 700,
};

export default App;

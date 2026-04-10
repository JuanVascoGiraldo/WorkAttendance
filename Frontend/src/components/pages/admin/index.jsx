import { useEffect, useState } from "react";
import { ROLE, translateRole } from "../../../configuration";
import UserCompleteTable from "../../UsersCompleteTable";
import { EditUserForm, RegisterUserForm } from "../../UserForm";
import { ErrorHandler } from "../../ui";
import Loading from "../ui";
import { useActions } from "../../../reducers/utils";
import { theme } from "../../theme";

function AdminPage() {
  const actions = useActions();
  const [users, setUsers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [savingCreate, setSavingCreate] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoadingUsers(true);
    setError(null);

    try {
      const results = await Promise.all([
        actions.getByRole(ROLE.USER),
        actions.getByRole(ROLE.SUPERVISOR),
      ]);

      const [usersResult, supervisorsResult] = results;
      setUsers(usersResult?.users || []);
      setSupervisors(supervisorsResult?.users || []);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (payload) => {
    setSavingCreate(true);
    setError(null);

    try {
      await actions.create(payload);
      await loadUsers();
    } catch (requestError) {
      setError(requestError);
    } finally {
      setSavingCreate(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!selectedUser) {
      return;
    }

    setSavingUpdate(true);
    setError(null);

    try {
      await actions.update(selectedUser.id, payload);
      await loadUsers();
    } catch (requestError) {
      setError(requestError);
    } finally {
      setSavingUpdate(false);
    }
  };

  if (loadingUsers) {
    return <Loading label="Cargando usuarios" />;
  }

  return (
    <section style={pageStyle}>
      <header style={headerStyle}>
        <h1 style={{ margin: 0, color: theme.color2 }}>Administracion</h1>
        <p style={{ margin: 0, color: "#58708f" }}>{translateRole(ROLE.ADMIN)} - gestion de usuarios</p>
      </header>

      <UserCompleteTable users={[...users, ...supervisors]} onSelectUser={setSelectedUser} />

      <div style={gridStyle}>
        <RegisterUserForm loading={savingCreate} onSubmit={handleCreate} supervisors={supervisors} />

        {selectedUser ? (
          <EditUserForm
            defaultValues={selectedUser}
            loading={savingUpdate}
            onSubmit={handleUpdate}
            onCancel={() => setSelectedUser(null)}
          />
        ) : (
          <section style={hintStyle}>
            <h2 style={{ marginTop: 0 }}>Modificar usuario</h2>
            <p style={{ margin: 0 }}>Selecciona un usuario de la tabla para editarlo.</p>
          </section>
        )}
      </div>

      <ErrorHandler error={error} onRetry={loadUsers} />
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
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
};

const hintStyle = {
  padding: "20px",
  borderRadius: theme.radiusMd,
  backgroundColor: "rgba(255,255,255,0.86)",
  border: `1px solid ${theme.color4}`,
  boxShadow: "0 10px 24px rgba(29,53,87,0.08)",
};

export default AdminPage;
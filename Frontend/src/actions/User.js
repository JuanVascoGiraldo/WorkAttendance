import Actions from "./Actions";

const basePath = "/users";

const User = {
  create: (payload) => Actions.post(`${basePath}/`, payload),
  update: (userId, payload) => Actions.put(`${basePath}/${userId}`, payload),
  login: (payload) => Actions.post(`${basePath}/login`, payload),
  getById: (userId) => Actions.get(`${basePath}/${userId}`),
  getByRole: (role) => Actions.get(`${basePath}/by-role/${role}`),
  getBySupervisorAndDate: (supervisorId, date) =>
    Actions.get(`${basePath}/by-supervisor/${supervisorId}?date=${encodeURIComponent(date)}`),
  check: (userId, payload) => Actions.post(`${basePath}/${userId}/check`, payload),
};

export default User;

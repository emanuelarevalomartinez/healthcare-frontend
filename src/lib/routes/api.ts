import { API_URL } from "../config/config";

export const apiRoutes = {
  connection: {
    health: `${API_URL}/health`,
  },
  auth: {
    register: `${API_URL}/auth/register`,
    login: `${API_URL}/auth/login`,
    refresh: `${API_URL}/auth/refresh`,
    logout: `${API_URL}/auth/logout`,
  },
  users: {
    list: `${API_URL}/users`,
    create: `${API_URL}/users`,
    edit: `${API_URL}/users/:id`,
    details: `${API_URL}/users/:id`,
    delete: `${API_URL}/users/:id`,
  },
};

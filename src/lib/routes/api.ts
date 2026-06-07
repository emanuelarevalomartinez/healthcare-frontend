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
  patients: {
    list: `${API_URL}/patients`,
    create: `${API_URL}/patients`,
    edit: `${API_URL}/patients/:id`,
    details: `${API_URL}/patients/:id`,
    delete: `${API_URL}/patients/:id`,
  },
   users: {
    list: `${API_URL}/users`,
    filter: `${API_URL}/users/filter`,
    create: `${API_URL}/users`,
    edit: `${API_URL}/users/:id`,
    details: `${API_URL}/users/:id`,
    delete: `${API_URL}/users/:id`,
  },
};

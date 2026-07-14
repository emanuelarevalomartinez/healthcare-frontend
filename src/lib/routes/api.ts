import { API_URL } from "../config/config";

export const apiRoutes = {
  connection: {
    health: `${API_URL}/health`,
  },
  auth: {
    register: `${API_URL}/auth/register`,
    login: `${API_URL}/auth/login`,
    me: `${API_URL}/auth/me`,
    refresh: `${API_URL}/auth/refresh`,
    logout: `${API_URL}/auth/logout`,
  },
   users: {
    list: `${API_URL}/users`,
    filter: `${API_URL}/users/filter`,
    create: `${API_URL}/users`,
    edit: `${API_URL}/users/:id`,
    details: `${API_URL}/users/:id`,
    delete: `${API_URL}/users/:id`,
  },
   patients: {
    list: `${API_URL}/patients`,
    create: `${API_URL}/patients`,
    edit: `${API_URL}/patients/:id`,
    details: `${API_URL}/patients/:id`,
    delete: `${API_URL}/patients/:id`,
  },
   doctors: {
    list: `${API_URL}/doctors`,
    create: `${API_URL}/doctors`,
    createWithUser: `${API_URL}/doctors/create-with-user`,
    edit: `${API_URL}/doctors/:id`,
    editWithUser: `${API_URL}/doctors/update-with-user/:userId`,
    details: `${API_URL}/doctors/:id`,
    delete: `${API_URL}/doctors/:id`,
    deleteDoctorByUserId: `${API_URL}/doctors/delete-with-user/:userId`,
  },
   appointments: {
    list: `${API_URL}/appointments`,
    filter: `${API_URL}/appointments/filter`,
    create: `${API_URL}/appointments`,
    edit: `${API_URL}/appointments/:id`,
    details: `${API_URL}/appointments/:id`,
    delete: `${API_URL}/appointments/:id`,
  },
};

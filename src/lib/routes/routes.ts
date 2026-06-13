import { Routes } from "./routes-type";

export const routes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },
  users: {
    root: "/users",
    create: "/users/create",
    edit: "/users/:id/edit",
    details: "/users/:id",
  },
  doctors: {
    root: "/doctors",
    create: "/doctors/create",
    edit: "/doctors/:id/edit",
    details: "/doctors/:id",
  },
  patients: {
    root: "/patients",
    create: "/patients/create",
    edit: "/patients/:id/edit",
    details: "/patients/:id",
  },
  appointments: {
    root: "/appointments",
    create: "/appointments/create",
    edit: "/appointments/:id/edit",
    details: "/appointments/:id",
  },
  root: "/"
} satisfies Routes;

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
  patients: {
    root: "/patients",
    create: "/patients/create",
    edit: "/patients/:id/edit",
    details: "/patients/:id",
  },
  root: "/"
} satisfies Routes;

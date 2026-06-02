import { Routes } from "./routes-type";

export const routes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },
  patients: {
    root: "/patients",
    create: "/patients/create",
    edit: "/patients/:id/edit"
  },
  root: "/"
} satisfies Routes;

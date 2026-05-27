import { Routes } from "./routes-type";

export const routes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },
  patients: "/patients",
  root: "/"
} satisfies Routes;

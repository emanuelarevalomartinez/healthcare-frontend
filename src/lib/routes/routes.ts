import { Routes } from "./routes-type";

export const routes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },
  dashboard: {
    notifications: {
      list: "/notifications",
      details: "/notifications/:id",
    },
    administration: {
      roles: {
        list: "/roles",
        create: "/roles/create",
        details: "/roles/:id",
        edit: "/roles/:id/edit",
      },
      users: {
        list: "/users",
        create: "/users/create",
        details: "/users/:id",
        edit: "/users/:id/edit",
      },
    },
  },
  root: "/"
} satisfies Routes;

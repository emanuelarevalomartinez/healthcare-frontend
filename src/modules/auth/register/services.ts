"use server";

import { apiRoutes, fetcher, POST_OPTIONS } from "@/lib";
import { UserCreateRequest } from "./types";



export const registerUser = async (data: UserCreateRequest) => {
  const response = await fetcher(apiRoutes.auth.register, {
    ...POST_OPTIONS,
    body: JSON.stringify(data),
  });
  return response.toJSON();
};
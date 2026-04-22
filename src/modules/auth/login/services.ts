'use server'

import { apiRoutes, fetcher, POST_OPTIONS } from "@/lib";
import { UserRegisterRequest } from "./types";

export const loginUser = async (data: UserRegisterRequest) => {

  const response = await fetcher(apiRoutes.auth.login, {
    ...POST_OPTIONS,
    body: JSON.stringify(data),
  });
  return response;
};
"use server"

import { apiRoutes, fetcher, GET_OPTIONS } from "@/lib";
import { UserApiResponse } from "../user/types";

export const findMyUser = async () => {
  const response = await fetcher<UserApiResponse>(
    apiRoutes.auth.me,
    {
      ...GET_OPTIONS,
    }
  );
  return response;
};
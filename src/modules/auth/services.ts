"use server"

import { apiRoutes, fetcher, GET_OPTIONS } from "@/lib";
import { UserWithDoctorandScheduleApiResponse } from "../user/types";

export const findMyUser = async () => {
  const response = await fetcher<UserWithDoctorandScheduleApiResponse>(
    apiRoutes.auth.me,
    {
      ...GET_OPTIONS,
    }
  );
  return response;
};
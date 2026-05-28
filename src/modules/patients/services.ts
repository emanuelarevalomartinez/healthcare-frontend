"use server";

import { apiRoutes, fetcher, GET_OPTIONS } from "@/lib";
import { ApiResponse } from "./list/patient-list";

export const getAllPatients = async (): Promise<ApiResponse> => {
  const response = await fetcher(apiRoutes.patients.list, {
    ...GET_OPTIONS,
  });
  return response;
};

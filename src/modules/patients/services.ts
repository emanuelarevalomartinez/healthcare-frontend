"use server";

import { apiRoutes, fetcher, GET_OPTIONS } from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import { PatientApiResponse } from "./types";

export const getAllPatients = async () => {
  return await fetcher<PaginatedData<PatientApiResponse>>(apiRoutes.patients.list, {
    ...GET_OPTIONS,
  });
};

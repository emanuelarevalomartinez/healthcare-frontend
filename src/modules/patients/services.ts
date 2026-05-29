"use server";

import { apiRoutes, fetcher, GET_OPTIONS } from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import { PatientApiResponse } from "./types";

export const getAllPatients = async (page: number = 0, size: number = 10) => {
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const urlWithParams = `${apiRoutes.patients.list}?${queryParams.toString()}`;

  return await fetcher<PaginatedData<PatientApiResponse>>(urlWithParams, {
    ...GET_OPTIONS,
  });
};
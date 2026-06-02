"use server";

import { apiRoutes, fetcher, GET_OPTIONS, POST_OPTIONS } from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import { PatientApiResponse, PatientCreateRequest } from "./types";

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

export const createPatient = async (data: PatientCreateRequest) => {
  const response = await fetcher(apiRoutes.patients.create, {
    ...POST_OPTIONS,
    body: JSON.stringify(data),
  });
  return response;
};

export const findPatientById = async (id: string) => {
  const response = await fetcher<PatientApiResponse>(
    apiRoutes.patients.details.replace(":id", id),
    {
      ...GET_OPTIONS,
    }
  );
  return response;
};

export const deletePatient = async (id: string) => {
  const response = await fetcher(apiRoutes.patients.delete.replace(":id", id), {
    method: "DELETE",
  });
  return response;
};

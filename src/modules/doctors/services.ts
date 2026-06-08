"use server";

import { apiRoutes, fetcher, GET_OPTIONS, POST_OPTIONS, PUT_OPTIONS } from "@/lib";
import { DoctorApiResponse, DoctorCreateRequest, DoctorUpdateRequest } from "./types";
import { PaginatedData } from "@/lib/server/api-response";

export const createDoctor = async (data: DoctorCreateRequest) => {
  const response = await fetcher(apiRoutes.doctors.create, {
    ...POST_OPTIONS,
    body: JSON.stringify(data),
  });
  return response;
};

export const updateDoctor = async (id: string, data: DoctorUpdateRequest) => {
  const response = await fetcher(apiRoutes.doctors.edit.replace(":id", id), {
    ...PUT_OPTIONS,
    body: JSON.stringify(data),
  });
  return response;
};

export const getAllDoctors = async (page: number = 0, size: number = 10) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const urlWithParams = `${apiRoutes.doctors.list}?${queryParams.toString()}`;

  return await fetcher<PaginatedData<DoctorApiResponse>>(urlWithParams, {
    ...GET_OPTIONS,
  });
};

export const findDoctorById = async (id: string) => {
  const response = await fetcher<DoctorApiResponse>(
    apiRoutes.doctors.details.replace(":id", id),
    {
      ...GET_OPTIONS,
    }
  );
  return response;
};

export const deleteDoctor = async (id: string) => {
  const response = await fetcher(apiRoutes.doctors.delete.replace(":id", id), {
    method: "DELETE",
  });
  return response;
};
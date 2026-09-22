"use server";

import { apiRoutes, fetcher, GET_OPTIONS, POST_OPTIONS, PUT_OPTIONS } from "@/lib";
import { DoctorApiResponse, DoctorWithSchedulesCreateRequest, DoctorUpdateRequest, DoctorWithUserAndScheduleApiResponse } from "./types";
import { PaginatedData } from "@/lib/server/api-response";
import { CreateDoctorWithUserAndSchedule, UpdateDoctorWithUserAndScheduleRequest } from "../doctor_schedule/types";

export const createDoctorWithSchedules = async (data: DoctorWithSchedulesCreateRequest) => {
  const response = await fetcher(apiRoutes.doctors.create, {
    ...POST_OPTIONS,
    body: JSON.stringify(data),
  });
  return response;
};

export const createDoctorWithUserAndSchedule = async (data: CreateDoctorWithUserAndSchedule) => {
  const response = await fetcher(apiRoutes.doctors.createWithUserAndSchedule, {
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

export const updateDoctorWithUserAndSchedule = async (userId: string, data: UpdateDoctorWithUserAndScheduleRequest) => {
  
  const response = await fetcher(apiRoutes.doctors.editWithUserAndSchedule.replace(":userId", userId), {
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

export const getAllDoctorsFiltered = async (page: number = 0, size: number = 10, search: string) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    search: search,
  });

  const urlWithParams = `${apiRoutes.doctors.filter}?${queryParams.toString()}`;

  const response = await fetcher<PaginatedData<DoctorWithUserAndScheduleApiResponse>>(urlWithParams, {
    ...GET_OPTIONS,
  });

  return response;
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

export const deleteDoctorAndItScheduleByUserId = async (userId: string) => {
  const response = await fetcher(apiRoutes.doctors.deleteDoctorAndScheduleByUserId.replace(":userId",userId), {
    method: "DELETE",
  });
  return response;
};
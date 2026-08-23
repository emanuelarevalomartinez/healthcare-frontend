"use server";

import {
  apiRoutes,
  fetcher,
  GET_OPTIONS,
  POST_OPTIONS,
  PUT_OPTIONS,
} from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import {
  AppointmentApiResponse,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
} from "./types";

export const createAppointment = async (data: AppointmentCreateRequest) => {
  const response = await fetcher(apiRoutes.appointments.create, {
    ...POST_OPTIONS,
    body: JSON.stringify(data),
  });
  return response;
};

export const updateAppointment = async (
  id: string,
  data: AppointmentUpdateRequest
) => {
  const response = await fetcher(
    apiRoutes.appointments.edit.replace(":id", id),
    {
      ...PUT_OPTIONS,
      body: JSON.stringify(data),
    }
  );
  return response;
};

export const getAllAppointmetsFiltered = async (
  page: number = 0,
  size: number = 10,
  date: string
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    date: date,
  });

  const urlWithParams = `${
    apiRoutes.appointments.filter
  }?${queryParams.toString()}`;

  const response = await fetcher<PaginatedData<AppointmentApiResponse>>(
    urlWithParams,
    {
      ...GET_OPTIONS,
    }
  );

  return response;
};

export const findAppointmentById = async (id: string) => {
  const response = await fetcher<AppointmentApiResponse>(
    apiRoutes.appointments.details.replace(":id", id),
    {
      ...GET_OPTIONS,
    }
  );
  return response;
};

export const deleteAppointment = async (id: string) => {
  const response = await fetcher(apiRoutes.appointments.delete.replace(":id", id), {
    method: "DELETE",
  });
  return response;
};

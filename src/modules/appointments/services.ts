"use server"

import { apiRoutes, fetcher, GET_OPTIONS } from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import { AppointmentApiResponse } from "./types";

export const getAllAppointmetsFiltered = async (page: number = 0, size: number = 10, date: string) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    date: date,
  });

  const urlWithParams = `${apiRoutes.appointments.filter}?${queryParams.toString()}`;

  const response = await fetcher<PaginatedData<AppointmentApiResponse>>(urlWithParams, {
    ...GET_OPTIONS,
  });

  return response;
};


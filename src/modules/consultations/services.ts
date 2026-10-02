"use server";

import { apiRoutes, fetcher, GET_OPTIONS } from "@/lib";
import { ConsultationApiResponse, GetConsultationsFilteredParams } from "./types";
import { PaginatedData } from "@/lib/server/api-response";

export const getAllConsultationsFiltered = async ({
  page = 0,
  size = 10,
  ascending,
  date,
}: GetConsultationsFilteredParams) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ascending: ascending.toString(),
    date,
  });

  const urlWithParams = `${
    apiRoutes.consultations.filter
  }?${queryParams.toString()}`;

  const response = await fetcher<PaginatedData<ConsultationApiResponse>>(
    urlWithParams,
    {
      ...GET_OPTIONS,
    }
  );

  return response;
};
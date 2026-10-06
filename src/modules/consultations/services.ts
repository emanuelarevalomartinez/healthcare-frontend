"use server";

import { apiRoutes, fetcher, GET_OPTIONS } from "@/lib";
import { ConsultationApiResponse, GetConsultationsFilteredParams, GetConsultationsSearchedParams } from "./types";
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

export const getAllConsultationsSearched = async ({
  page = 0,
  size = 10,
  ascending = true,
  searchTerm,
}: GetConsultationsSearchedParams) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ascending: ascending.toString(),
    searchTerm: searchTerm,
  });

  const urlWithParams = `${
    apiRoutes.consultations.search
  }?${queryParams.toString()}`;

  const response = await fetcher<PaginatedData<ConsultationApiResponse>>(
    urlWithParams,
    {
      ...GET_OPTIONS,
    }
  );

  return response;
};

export const deleteConsultation = async (id: string) => {
  const response = await fetcher(
    apiRoutes.consultations.delete.replace(":id", id),
    {
      method: "DELETE",
    }
  );
  return response;
};
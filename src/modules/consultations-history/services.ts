"use server";

import { apiRoutes, fetcher, GET_OPTIONS } from "@/lib";
import { ConsultationHistoriesApiResponse, GetConsultationHistoriesGroupParams } from "./types";
import { PaginatedData } from "@/lib/server/api-response";


export const findConsultationHistoriesGroupedByDate = async ({
  page = 0,
  size = 10,
  ascending = false,
}: GetConsultationHistoriesGroupParams) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ascending: ascending.toString(),
  });

  const urlWithParams = `${
    apiRoutes.consultation_histories.list
  }?${queryParams.toString()}`;

  const response = await fetcher<PaginatedData<ConsultationHistoriesApiResponse>>(
    urlWithParams,
    {
      ...GET_OPTIONS,
    }
  );

  return response;
};

export const deleteConsultationHistoryById = async (id: string) => {
  const response = await fetcher(
    apiRoutes.consultation_histories.delete.replace(":id", id),
    {
      method: "DELETE",
    }
  );
  return response;
};

export const deleteConsultationHistoryByDate = async (date: string) => {
  const response = await fetcher(
    `${apiRoutes.consultation_histories.deleteByDate}?date=${date}`,
    {
      method: "DELETE",
    }
  );
  return response;
};

export const deleteAllConsultationHistories = async () => {
  const response = await fetcher(
    apiRoutes.consultation_histories.deleteAll,
    {
      method: "DELETE",
    }
  );
  return response;
};
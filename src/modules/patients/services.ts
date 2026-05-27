"use server";

import { apiRoutes, fetcher, GET_OPTIONS } from "@/lib";

export const getAllPatients = async () => {
  const response = await fetcher(apiRoutes.patients.list, {
    ...GET_OPTIONS,
  });
  return response;
};

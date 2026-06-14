"use server";

import { apiRoutes, fetcher, GET_OPTIONS, POST_OPTIONS, PUT_OPTIONS } from "@/lib";
import { ApiResponse, PaginatedData } from "@/lib/server/api-response";
import { UserApiResponse, UserCreateRequest, UserUpdateRequest } from "./types";

export const createUser = async (data: UserCreateRequest) => {
  const response = await fetcher<UserApiResponse>(apiRoutes.users.create, {
    ...POST_OPTIONS,
    body: JSON.stringify(data),
  });
  return response;
};

export const updateUser = async (id: string, data: UserUpdateRequest) => {
  const response = await fetcher<UserApiResponse>(apiRoutes.users.edit.replace(":id", id), {
    ...PUT_OPTIONS,
    body: JSON.stringify(data),
  });
  return response;
};

export const getAllUsers = async (page: number = 0, size: number = 10) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const urlWithParams = `${apiRoutes.users.list}?${queryParams.toString()}`;

  return await fetcher<PaginatedData<UserApiResponse>>(urlWithParams, {
    ...GET_OPTIONS,
  });
};

export const findUserById = async (id: string) => {
  const response = await fetcher<UserApiResponse>(
    apiRoutes.users.details.replace(":id", id),
    {
      ...GET_OPTIONS,
    }
  );
  return response;
};

export const deleteUser = async (id: string) => {
  const response = await fetcher(apiRoutes.users.delete.replace(":id", id), {
    method: "DELETE",
  });
  return response;
};
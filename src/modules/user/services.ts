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
  UserCreateRequest,
  UserUpdateRequest,
  UserWithDoctorandScheduleApiResponse,
} from "./types";
import { GetUsersSearchedParams } from "../patients/types";

export const createUser = async (data: UserCreateRequest) => {
  const response = await fetcher<UserWithDoctorandScheduleApiResponse>(
    apiRoutes.users.create,
    {
      ...POST_OPTIONS,
      body: JSON.stringify(data),
    }
  );
  return response;
};

export const updateUser = async (id: string, data: UserUpdateRequest) => {
  const response = await fetcher<UserWithDoctorandScheduleApiResponse>(
    apiRoutes.users.edit.replace(":id", id),
    {
      ...PUT_OPTIONS,
      body: JSON.stringify(data),
    }
  );
  return response;
};

export const getAllUsers = async (page: number = 0, size: number = 10) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const urlWithParams = `${apiRoutes.users.list}?${queryParams.toString()}`;

  const response = await fetcher<
    PaginatedData<UserWithDoctorandScheduleApiResponse>
  >(urlWithParams, {
    ...GET_OPTIONS,
  });

  return response;
};

export const getAllUsersSearched = async ({
  page = 0,
  size = 10,
  searchTerm,
  userRole,
  active,
}: GetUsersSearchedParams) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    searchTerm: searchTerm,
  });

  if (userRole) {
    queryParams.set("userRole", userRole);
  }

  if (active !== undefined) {
    queryParams.set("active", active.toString());
  }

  const urlWithParams = `${apiRoutes.users.search}?${queryParams.toString()}`;

  const response = await fetcher<
    PaginatedData<UserWithDoctorandScheduleApiResponse>
  >(urlWithParams, {
    ...GET_OPTIONS,
  });

  return response;
};

export const findUserById = async (id: string) => {
  const response = await fetcher<UserWithDoctorandScheduleApiResponse>(
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

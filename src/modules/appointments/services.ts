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
  GetAppointmentsFilteredParams,
  GetAppointmentsSearchedParams,
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

export const getAllAppointmetsFiltered = async ({
  page = 0,
  size = 10,
  ascending,
  date,
  appointmentStatus,
  patientFullName,
  doctorUserName,
  patientMedicalRecordNumber,
  patientDocumentType,
  patientDocumentNumber,
  doctorSpecialty,
  doctorLicenseNumber,
}: GetAppointmentsFilteredParams) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ascending: ascending.toString(),
    date,
  });

  if (appointmentStatus) {
    queryParams.set("appointmentStatus", appointmentStatus);
  }

  if (patientFullName) {
    queryParams.set("patientFullName", patientFullName);
  }

  if (doctorUserName) {
    queryParams.set("doctorUserName", doctorUserName);
  }

  if (patientMedicalRecordNumber) {
    queryParams.set("patientMedicalRecordNumber", patientMedicalRecordNumber);
  }

  if (patientDocumentType) {
    queryParams.set("patientDocumentType", patientDocumentType);
  }

  if (patientDocumentNumber) {
    queryParams.set("patientDocumentNumber", patientDocumentNumber);
  }

  if (doctorSpecialty) {
    queryParams.set("doctorSpecialty", doctorSpecialty);
  }

  if (doctorLicenseNumber) {
    queryParams.set("doctorLicenseNumber", doctorLicenseNumber);
  }

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

export const getAllAppointmentsSearched = async ({
  page = 0,
  size = 10,
  ascending = true,
  searchTerm,
  appointmentStatus,
  documentType,
}: GetAppointmentsSearchedParams) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ascending: ascending.toString(),
    searchTerm: searchTerm,
  });

  if (appointmentStatus) {
    queryParams.set("appointmentStatus", appointmentStatus);
  }

  if (documentType) {
    queryParams.set("documentType", documentType);
  }

  const urlWithParams = `${
    apiRoutes.appointments.search
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
  const response = await fetcher(
    apiRoutes.appointments.delete.replace(":id", id),
    {
      method: "DELETE",
    }
  );
  return response;
};

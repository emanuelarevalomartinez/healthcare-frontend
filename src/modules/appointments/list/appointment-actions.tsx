"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ALERT_ACTION,
  APPOINTMENT_STATUS,
  routes,
  TranslationDictionary,
} from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import { AppointmentApiResponse } from "../types";
import {
  deleteAppointment,
  getAllAppointmentsSearched,
  getAllAppointmetsFiltered,
  updateAppointment,
} from "../services";
import { format, parse } from "date-fns";
import { TableAction } from "@/components/customs/table-wrapper";
import { toast } from "sonner";
import {
  getAppointmentSelectedDateToViewLocalStorage,
  setAppointmentSelectedDateToViewLocalStorage,
} from "@/lib/utils/local-storage";
import { PATIENT_DOCUMENT_TYPE } from "@/modules/patients/types";

interface UsePatientsActionsProps {
  dictionary: TranslationDictionary;
}

export function useAppointmentActions({ dictionary }: UsePatientsActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.appointments;

  const [alertActionType, setAlertActionType] = useState<ALERT_ACTION | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentToDelete, setAppointmentToDelete] = useState<{
    id: string;
  } | null>(null);
  const [appointmentDataToCancel, setAppointmentDataToCancel] =
    useState<AppointmentApiResponse | null>(null);
  const [appointmentDataToConfirm, setAppointmentDataToConfirm] =
    useState<AppointmentApiResponse | null>(null);
  const [appointmentsData, setAppointmentsData] =
    useState<PaginatedData<AppointmentApiResponse>>();

  const [appointmentsSearchData, setAppointmentsSearchData] =
    useState<PaginatedData<AppointmentApiResponse>>();

  const [statusFilter, setStatusFilter] = useState<
    APPOINTMENT_STATUS | undefined
  >(undefined);
  const [documentTypeFilter, setDocumentTypeFilter] = useState<
    PATIENT_DOCUMENT_TYPE | undefined
  >(undefined);

  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSearchView, setIsSearchView] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  useEffect(() => {
    const savedData = getAppointmentSelectedDateToViewLocalStorage();

    if (savedData) {
      setSelectedDate(parse(savedData.selectedDate, "yyyy-MM-dd", new Date()));
      return;
    }

    const currentDate = new Date();

    setSelectedDate(currentDate);

    setAppointmentSelectedDateToViewLocalStorage({
      selectedDate: format(currentDate, "yyyy-MM-dd"),
    });
  }, []);

  const [isCancelDialogWrapperOpen, setIsCancelDialogWrapperOpen] =
    useState<boolean>(false);
  const pageSize = 10;

  const fetchAppointmentsFiltered = useCallback(
    async (date?: Date) => {
      const dateToUse = date ?? selectedDate;

      if (!dateToUse) return;

      setIsLoading(true);

      try {
        const dateString = format(dateToUse, "yyyy-MM-dd");

        const response = await getAllAppointmetsFiltered({
          page: currentPage,
          size: pageSize,
          ascending: true,
          date: dateString,
        });

        setAppointmentsData(response.data);
      } catch (error) {
        console.error("Error to load the appointments: ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, selectedDate]
  );

  const fetchAppointmentsSearched = useCallback(
    async (searchTerm: string) => {
      setIsLoading(true);

      try {
        const response = await getAllAppointmentsSearched({
          page: currentPage,
          size: pageSize,
          ascending: true,
          searchTerm: searchTerm,
          ...(statusFilter !== undefined && {
            appointmentStatus: statusFilter,
          }),
          ...(documentTypeFilter !== undefined && {
            documentType: documentTypeFilter,
          }),
        });

        setAppointmentsSearchData(response.data);
      } catch (error) {
        console.error("Error to load searched appointments: ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, statusFilter, documentTypeFilter]
  );

  const fetchAppointments = useCallback(
    async (searchTerm?: string) => {
      const normalizedSearchTerm = searchTerm?.trim();

      if (isFiltersVisible && !normalizedSearchTerm) {
        return;
      } else if (
        (isFiltersVisible || !isFiltersVisible) &&
        normalizedSearchTerm
      ) {
        setIsSearchView(true);
        await fetchAppointmentsSearched(normalizedSearchTerm);
      } else if (!isFiltersVisible && !normalizedSearchTerm) {
        setIsSearchView(false);
        await fetchAppointmentsFiltered();
      }
    },
    [fetchAppointmentsFiltered, fetchAppointmentsSearched]
  );

  const handleDateChange = useCallback(
    (newDate: Date | undefined) => {
      if (!newDate) return;

      setSelectedDate(newDate);

      setAppointmentSelectedDateToViewLocalStorage({
        selectedDate: format(newDate, "yyyy-MM-dd"),
      });

      fetchAppointmentsFiltered(newDate);
    },
    [fetchAppointmentsFiltered]
  );

  const handleOpenDeleteConfirm = (id: string) => {
    setAppointmentToDelete({ id });
    setAlertActionType(ALERT_ACTION.DELETE);
  };

  const handleOpenCancelConfirm = (appointment: AppointmentApiResponse) => {
    setAppointmentDataToCancel(appointment);
    setIsCancelDialogWrapperOpen(true);
  };

  const handleOpenConfirm = (appointment: AppointmentApiResponse) => {
    setAppointmentDataToConfirm(appointment);
    setAlertActionType(ALERT_ACTION.CONFIRM);
  };

  const handleCloseAlert = () => {
    setAlertActionType(null);
    setAppointmentToDelete(null);
    setAppointmentDataToConfirm(null);
  };

  const handleExecuteDelete = async () => {
    if (!appointmentToDelete) return;
    try {
      const response = await deleteAppointment(appointmentToDelete.id);
      if (response.status === 200 || response.status === 204) {
        toast.success(t.successDeleteAppointmentToast);

        if (appointmentsData?.content.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          await fetchAppointments();
        }
      }
    } catch (error) {
      console.error("Error to delete:", error);
      toast.error(t.errorDeleteAppointmentToast);
    } finally {
      setAppointmentToDelete(null);
      setIsCancelDialogWrapperOpen(false);
    }
  };

  const handleExecuteConfirm = async () => {
    if (!appointmentDataToConfirm) return;
    try {
      const response = await updateAppointment(appointmentDataToConfirm.id, {
        status: APPOINTMENT_STATUS.CONFIRMED,
      });
      if (response.status === 200 || response.status === 204) {
        toast.success(t.toastUpdateSuccess);

        if (appointmentsData?.content.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          await fetchAppointments();
        }
      }
    } catch (error) {
      console.error("Error to confirm:", error);
      toast.error(t.errorDeleteAppointmentToast);
    } finally {
      setAppointmentDataToConfirm(null);
    }
  };

  const appointmentActions: TableAction<AppointmentApiResponse>[] = [
    {
      label: dictionary.components.actions.viewDetails,
      onClick: (p) =>
        router.push(routes.appointments.details.replace(":id", p.id)),
    },
    {
      label: dictionary.components.actions.edit,
      onClick: (p) =>
        router.push(routes.appointments.edit.replace(":id", p.id)),
    },

    {
      label: dictionary.components.actions.cancel,
      onClick: (p) => handleOpenCancelConfirm(p),
      disabled: (p) =>
        p.status === APPOINTMENT_STATUS.CANCELLED ||
        p.status === APPOINTMENT_STATUS.ATTENDED ||
        p.status === APPOINTMENT_STATUS.NO_SHOW,
    },
    {
      label: dictionary.components.actions.confirm,
      onClick: (p) => handleOpenConfirm(p),
      disabled: (p) =>
        p.status === APPOINTMENT_STATUS.CONFIRMED ||
        p.status === APPOINTMENT_STATUS.CANCELLED ||
        p.status === APPOINTMENT_STATUS.ATTENDED ||
        p.status === APPOINTMENT_STATUS.NO_SHOW,
    },
    {
      label: dictionary.components.actions.delete,
      variant: "destructive",
      separatorBefore: true,
      onClick: (p) => handleOpenDeleteConfirm(p.id),
    },
  ];

  const getAppointmentStatusOptions = useCallback((optionsDict: any) => {
    return Object.values(APPOINTMENT_STATUS).map((appointmentItem) => {
      const appointmentKey = appointmentItem.toLowerCase() as
        | "scheduled"
        | "confirmed"
        | "attended"
        | "cancelled"
        | "no_show";
      return { value: appointmentItem, label: optionsDict[appointmentKey] };
    });
  }, []);

  const getDocumentTypeStatusOptions = useCallback((optionsDict: any) => {
    return Object.values(PATIENT_DOCUMENT_TYPE).map((docType) => {
      const docTypeKey = docType.toLowerCase() as
        | "dni"
        | "passport"
        | "id_card"
        | "other";
      return { value: docType, label: optionsDict[docTypeKey] };
    });
  }, []);

  return {
    appointmentsData,
    appointmentsSearchData,
    currentPage,
    setCurrentPage,
    isLoading,
    selectedDate,
    setSelectedDate: handleDateChange,
    appointmentActions,
    handleExecuteDelete,
    isCancelDialogWrapperOpen,
    setIsCancelDialogWrapperOpen,
    appointmentDataToCancel,
    alertActionType,
    handleExecuteConfirm,
    handleCloseAlert,
    searchTerm,
    setSearchTerm,
    fetchAppointments,
    isSearchView,
    statusFilter,
    setStatusFilter,
    documentTypeFilter,
    setDocumentTypeFilter,
    getAppointmentStatusOptions,
    getDocumentTypeStatusOptions,
    isFiltersVisible,
    setIsFiltersVisible,
  };
}

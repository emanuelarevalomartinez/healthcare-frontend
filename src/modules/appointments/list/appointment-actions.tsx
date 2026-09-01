"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ALERT_ACTION,
  APPOINTMENT_STATUS,
  getErrorMessage,
  routes,
  TranslationDictionary,
} from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import { AppointmentApiResponse } from "../types";
import {
  deleteAppointment,
  getAllAppointmetsFiltered,
  updateAppointment,
} from "../services";
import { format } from "date-fns";
import { TableAction } from "@/components/customs/table-wrapper";
import { toast } from "sonner";

interface UsePatientsActionsProps {
  dictionary: TranslationDictionary;
}

export function useAppointmentActions({ dictionary }: UsePatientsActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.appointments;

  const [alertActionType, setAlertActionType] = useState<ALERT_ACTION | null>(
    null
  );
  const [appointmentToDelete, setAppointmentToDelete] = useState<{
    id: string;
  } | null>(null);
  const [appointmentDataToCancel, setAppointmentDataToCancel] =
    useState<AppointmentApiResponse | null>(null);
  const [appointmentDataToConfirm, setAppointmentDataToConfirm] =
    useState<AppointmentApiResponse | null>(null);
  const [appointmentsData, setAppointmentsData] =
    useState<PaginatedData<AppointmentApiResponse>>();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [isCancelDialogWrapperOpen, setIsCancelDialogWrapperOpen] =
    useState<boolean>(false);
  const pageSize = 10;

  const fetchAppointmentsFiltered = useCallback(
    async (date?: Date) => {
      setIsLoading(true);
      try {
        const dateToUse = date || selectedDate;
        const dateString = format(dateToUse, "yyyy-MM-dd");

        const response = await getAllAppointmetsFiltered(
          currentPage,
          pageSize,
          dateString
        );
        setAppointmentsData(response.data);
      } catch (error) {
        console.error("Error to load the appointments: ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, pageSize, selectedDate]
  );

  const handleDateChange = useCallback(
    (newDate: Date | undefined) => {
      if (newDate) {
        setSelectedDate(newDate);

        fetchAppointmentsFiltered(newDate);
      }
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
          await fetchAppointmentsFiltered();
        }
      }
    } catch (error) {
      console.error("Error to delete:", error);
     /*  const errorMessage = getErrorMessage(error);
      toast.error(errorMessage ?? t.errorDeleteAppointmentToast); */
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
          await fetchAppointmentsFiltered();
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
      disabled: (p) => p.status === APPOINTMENT_STATUS.CANCELLED || p.status === APPOINTMENT_STATUS.ATTENDED || p.status === APPOINTMENT_STATUS.NO_SHOW,
    },
    {
      label: dictionary.components.actions.confirm,
      onClick: (p) => handleOpenConfirm(p),
      disabled: (p) => p.status === APPOINTMENT_STATUS.CONFIRMED || p.status === APPOINTMENT_STATUS.CANCELLED || p.status === APPOINTMENT_STATUS.ATTENDED || p.status === APPOINTMENT_STATUS.NO_SHOW,
    },
    {
      label: dictionary.components.actions.delete,
      variant: "destructive",
      separatorBefore: true,
      onClick: (p) => handleOpenDeleteConfirm(p.id),
    },
  ];

  return {
    appointmentsData,
    currentPage,
    setCurrentPage,
    isLoading,
    selectedDate,
    setSelectedDate: handleDateChange,
    fetchAppointmentsFiltered,
    appointmentActions,
    handleExecuteDelete,
    isCancelDialogWrapperOpen,
    setIsCancelDialogWrapperOpen,
    appointmentDataToCancel,
    alertActionType,
    handleExecuteConfirm,
    handleCloseAlert,
  };
}

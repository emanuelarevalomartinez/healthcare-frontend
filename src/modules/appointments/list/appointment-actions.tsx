"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { APPOINTMENT_STATUS, routes, TranslationDictionary } from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import { AppointmentApiResponse } from "../types";
import { deleteAppointment, getAllAppointmetsFiltered } from "../services";
import { format } from "date-fns";
import { TableAction } from "@/components/customs/table-wrapper";
import { toast } from "sonner";

interface UsePatientsActionsProps {
  dictionary: TranslationDictionary;
}

export function useAppointmentActions({ dictionary }: UsePatientsActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.appointments;

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<{
    id: string;
  } | null>(null);
   const [appointmentDataToCancel, setAppointmentDataToCancel] = useState<AppointmentApiResponse | null>(null);
  const [appointmentsData, setAppointmentsData] =
    useState<PaginatedData<AppointmentApiResponse>>();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [isCancelDialogWrapperOpen, setIsCancelDialogWrapperOpen] = useState<boolean>(false);
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
    setIsAlertOpen(true);
  };

   const handleOpenCancelConfirm = (appointment: AppointmentApiResponse) => {
    setAppointmentDataToCancel(appointment);
    setIsCancelDialogWrapperOpen(true);
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
      toast.error(t.errorDeleteAppointmentToast);
    } finally {
      setIsAlertOpen(false);
      setAppointmentToDelete(null);
      setIsCancelDialogWrapperOpen(false);
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
      onClick: (p) => router.push(routes.appointments.edit.replace(":id", p.id)),
    },

    {
      label: dictionary.components.actions.cancel,
      onClick: (p) => handleOpenCancelConfirm(p),
      disabled: (p) => p.status === APPOINTMENT_STATUS.CANCELLED,
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
    isAlertOpen,
    setIsAlertOpen,
    handleExecuteDelete,
    setAppointmentToDelete,
    isCancelDialogWrapperOpen,
    setIsCancelDialogWrapperOpen,
    appointmentDataToCancel
  };
}

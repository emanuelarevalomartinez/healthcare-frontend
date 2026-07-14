"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TranslationDictionary } from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import { AppointmentApiResponse } from "../types";
import { getAllAppointmetsFiltered } from "../services";
import { format } from "date-fns";

interface UsePatientsActionsProps {
  dictionary: TranslationDictionary;
}

export function useAppointmentActions({ dictionary }: UsePatientsActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.appointments;

  const [appointmentsData, setAppointmentsData] = useState<PaginatedData<AppointmentApiResponse>>();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const pageSize = 10;

  const fetchAppointmentsFiltered = useCallback(async (date?: Date) => {
    setIsLoading(true);
    try {

      const dateToUse = date || selectedDate;
      const dateString = format(dateToUse, 'yyyy-MM-dd');

      const response = await getAllAppointmetsFiltered(currentPage, pageSize, dateString);
      setAppointmentsData(response.data);
    } catch (error) {
      console.error("Error to load the appointments: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedDate]);

    const handleDateChange = useCallback((newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate);

      fetchAppointmentsFiltered(newDate);
    }
  }, [fetchAppointmentsFiltered]);

/* 
  const appointmentsActions: TableAction<UserApiResponse>[] = [
    {
      label: dictionary.components.actions.viewDetails,
      onClick: (e) => router.push(routes.users.details.replace(":id", e.id)),
    },
    {
      label: (user) =>
        user.isActive
          ? dictionary.components.actions.deactivate
          : dictionary.components.actions.activate,
      onClick: (user) => {
        console.log(user.isActive);
        handleActivateUser(user.id, user.isActive);
      },
    },
    {
      label: dictionary.components.actions.edit,
      onClick: (e) => router.push(routes.users.edit.replace(":id", e.id)),
    },
    {
      label: dictionary.components.actions.delete,
      variant: "destructive",
      separatorBefore: true,
      onClick: (e) => handleOpenDeleteConfirm(e.id, e.username),
      disabled: (user) => user.id === currentUserId,
    },
  ]; */

  return {
    appointmentsData,
    isAlertOpen,
    setIsAlertOpen,
    currentPage,
    setCurrentPage,
    isLoading,
    selectedDate,
    setSelectedDate: handleDateChange,
    fetchAppointmentsFiltered,
  };
}

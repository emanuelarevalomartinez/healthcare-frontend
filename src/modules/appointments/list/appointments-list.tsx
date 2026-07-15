"use client";

import { Calendar } from "@/components/ui/calendar";
import { SectionHeader } from "@/components/customs/secction-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2Icon, UserPlusIcon } from "lucide-react";
import { routes, useLanguage } from "@/lib";
import { DialogWrapper } from "@/components/customs/dialog-wrapper";
import { useEffect, useState } from "react";
import { AppointmentDetails } from "../details/appointments-details";
import { AppointmentSearch } from "./appointment-search";
import { useAppointmentActions } from "./appointment-actions";
import {
  formatDisplayDateTimeToLocaleString,
  formatSelectedDateToInputString,
} from "@/lib/utils/functions";
import { AppointmentApiResponse } from "../types";
import { AppointmentListDaily } from "./appointment-list-daily";

export function AppointmentsList() {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.appointments;
  const router = useRouter();

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentApiResponse | null>(null);

  const {
    appointmentsData,
    isAlertOpen,
    setIsAlertOpen,
    setCurrentPage,
    selectedDate,
    setSelectedDate,
    fetchAppointmentsFiltered,
    isLoading,
  } = useAppointmentActions({ dictionary });

  useEffect(() => {
    fetchAppointmentsFiltered();
  }, [fetchAppointmentsFiltered]);


  return (
    <>
      <div className="space-y-4 p-1">
        <div className="flex flex-col w-full">
          <div>
            <SectionHeader
              title={"Agenda y Citas Médicas"}
              description={"Consulta y gestiona las citas médicas"}
            >
              <Button
                onClick={() => router.push(routes.appointments.create)}
                className="w-full sm:w-auto shadow-sm"
              >
                <UserPlusIcon className="mr-2 size-4" />
                {"Nueva Cita"}
              </Button>
            </SectionHeader>
          </div>

          {/*  <div>
            <AppointmentSearch />
          </div> */}

          <div className="flex flex-col 2xl:flex-row gap-1 pt-4">
            <div className="flex w-full 2xl:w-2/3">
              <Calendar
                className="w-full rounded-lg border border-border"
                captionLayout="dropdown"
                buttonVariant="outline"
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
              />
            </div>

            <div className="flex w-full 2xl:w-1/3">
              <AppointmentListDaily
                appointmentsData={appointmentsData}
                selectedDate={selectedDate}
                isLoading={isLoading}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

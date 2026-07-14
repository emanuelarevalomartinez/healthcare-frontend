"use client";

import { Calendar } from "@/components/ui/calendar";
import { SectionHeader } from "@/components/customs/secction-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserPlusIcon } from "lucide-react";
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

  const appointments = appointmentsData?.content ?? [];
  const totalAppointments = appointmentsData?.totalElements ?? 0;
  const hasAppointments = appointments.length > 0;

  return (
    <>
      <div className="space-y-4 p-1">
        <DialogWrapper
          open={openDetails}
          onOpenChange={setOpenDetails}
          title="Detalle de la cita"
        >
          {selectedAppointment && (
            <AppointmentDetails appointment={selectedAppointment} />
          )}
        </DialogWrapper>

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

          <div className="flex gap-1 pt-4">
            <div className="flex w-2/3">
              <Calendar
                className="w-full rounded-lg border border-border"
                captionLayout="dropdown"
                showWeekNumber
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

            {/* ✅ LISTA DE CITAS */}
            <div className="w-1/3 border border-border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">
                  Citas del {formatSelectedDateToInputString(selectedDate)}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {totalAppointments} cita{totalAppointments !== 1 ? 's' : ''}
                </span>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Cargando citas...
                </div>
              ) : !hasAppointments ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay citas para este día
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {appointments.map((appointment) => (
                    <button
                      key={appointment.id}
                      className="w-full border border-border rounded-md p-3 mb-2 text-left hover:bg-accent transition-colors"
                      onClick={() => {
                        setOpenDetails(true);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {formatDisplayDateTimeToLocaleString(
                              appointment.appointmentDateTime
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.consultationReason}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            {appointment.durationMinutes} min
                          </div>
                        </div>
                      </div>
                      <div className="mt-1">
                        <span
                          className={`
                          text-xs px-2 py-0.5 rounded-full
                          ${
                            appointment.status === "CONFIRMED"
                              ? "bg-green-100 text-green-700"
                              : ""
                          }
                          ${
                            appointment.status === "SCHEDULED"
                              ? "bg-blue-100 text-blue-700"
                              : ""
                          }
                          ${
                            appointment.status === "ATTENDED"
                              ? "bg-gray-100 text-gray-700"
                              : ""
                          }
                          ${
                            appointment.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : ""
                          }
                          ${
                            appointment.status === "NO_SHOW"
                              ? "bg-red-100 text-red-700"
                              : ""
                          }
                        `}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

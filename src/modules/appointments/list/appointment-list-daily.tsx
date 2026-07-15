"use client";

import { useLanguage } from "@/lib";
import { useAppointmentActions } from "./appointment-actions";
import {
  formatDisplayDateTimeToLocaleString,
  formatSelectedDateToInputString,
} from "@/lib/utils/functions";
import { DialogWrapper } from "@/components/customs/dialog-wrapper";
import { useState } from "react";
import { AppointmentApiResponse } from "../types";
import { AppointmentDetails } from "../details/appointments-details";
import { PaginatedData } from "@/lib/server/api-response";
import { BadgeWrapper } from "@/components/customs/badge-wrapper";
import { TablePagination } from "@/components/customs/table-pagination";
import { Loader2Icon } from "lucide-react";

interface Props {
  appointmentsData?: PaginatedData<AppointmentApiResponse>;
  selectedDate: Date;
  isLoading: boolean;
  setCurrentPage: (e: number) => void;
}

export function AppointmentListDaily({
  appointmentsData,
  selectedDate,
  isLoading,
  setCurrentPage,
}: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.appointments;

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentApiResponse | null>(null);

  const appointments = appointmentsData?.content ?? [];
  const totalAppointments = appointmentsData?.totalElements ?? 0;
  const hasAppointments = appointments.length > 0;

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-[66vh] w-full">
      <Loader2Icon className="size-10 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground animate-pulse">
        {dictionary.components.loading.text}
      </p>
    </div>
  );

  return (
    <>
      <DialogWrapper
        open={openDetails}
        onOpenChange={setOpenDetails}
        title="Detalle de la cita"
      >
        {selectedAppointment && (
          <AppointmentDetails appointment={selectedAppointment} />
        )}
      </DialogWrapper>

      <div className="w-full border border-border rounded-lg p-4 h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">
            Citas del {formatSelectedDateToInputString(selectedDate)}
          </h3>
          <span className="text-sm text-muted-foreground">
            {totalAppointments} cita{totalAppointments !== 1 ? "s" : ""}
          </span>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : !hasAppointments ? (
          <div className="text-center py-8 text-muted-foreground h-[66vh]">
            No hay citas para este día
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto h-[66vh] border-y py-2 border-border">
            {appointments.map((appointment) => (
              <button
                key={appointment.id}
                className="w-full border border-border rounded-md p-3 mb-2 text-left hover:bg-secondary transition-colors"
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
                  {/* <span
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
                        </span> */}
                  <BadgeWrapper />
                </div>
              </button>
            ))}
          </div>
        )}

        <div>
          {appointmentsData && (
            <TablePagination
              page={appointmentsData.page}
              size={appointmentsData.size}
              totalElements={appointmentsData.totalElements}
              totalPages={appointmentsData.totalPages}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />
          )}
        </div>
      </div>
    </>
  );
}

"use client";

import { APPOINTMENT_STATUS, useLanguage } from "@/lib";
import {
  formatDisplayDateTimeToLocaleString,
  formatSelectedDateToInputString,
  statusBadgeMap,
} from "@/lib/utils/functions";
import { DialogWrapper } from "@/components/customs/dialog-wrapper";
import { AppointmentApiResponse } from "../types";
import { AppointmentDetails } from "../details/appointments-details";
import { PaginatedData } from "@/lib/server/api-response";
import { BadgeWrapper } from "@/components/customs/badge-wrapper";
import { TablePagination } from "@/components/customs/table-pagination";
import { Loader2Icon } from "lucide-react";

interface Props {
  appointmentsData?: PaginatedData<AppointmentApiResponse>;
  openDetails: boolean;
  setOpenDetails: (e: boolean) => void;
  selectedAppointment: AppointmentApiResponse | null;
  setSelectedAppointment: (e: AppointmentApiResponse | null) => void;
  selectedDate: Date;
  isLoading: boolean;
  setCurrentPage: (e: number) => void;
}

export function AppointmentListDaily({
  appointmentsData,
  openDetails,
  setOpenDetails,
  selectedAppointment,
  setSelectedAppointment,
  selectedDate,
  isLoading,
  setCurrentPage,
}: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.appointments;

  const appointments = appointmentsData?.content ?? [];
  const totalAppointments = appointmentsData?.totalElements ?? 0;
  const hasAppointments = appointments.length > 0;

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-[64vh] 2xl:h-[64vh] w-full">
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
        className="sm:min-w-xl md:min-w-3xl"
        onOpenChange={setOpenDetails}
        title="Detalle de la cita"
      >
        {selectedAppointment && (
          <AppointmentDetails appointment={selectedAppointment} />
        )}
      </DialogWrapper>

      <div className="w-full rounded-lg">
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
          <div className="text-center place-content-center items-center py-8 text-muted-foreground h-[74vh]">
            No hay citas para este día
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto h-[60vh] border-y py-2 border-border">
            {appointments.map((appointment) => (
              <button
                key={appointment.id}
                className="w-full border border-border rounded-md p-3 mb-2 text-left hover:bg-secondary transition-colors"
                onClick={() => {
                  setOpenDetails(true);
                  setSelectedAppointment(appointment);
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
                      Doctor: {appointment.doctorFullName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Paciente: {appointment.patientFullName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {appointment.durationMinutes} min
                    </div>
                  </div>
                </div>
                <div className="mt-1">
                  <BadgeWrapper
                    type={
                      statusBadgeMap[appointment.status as APPOINTMENT_STATUS]
                    }
                  >
                    {t.status[appointment.status as APPOINTMENT_STATUS]}
                  </BadgeWrapper>
                </div>
              </button>
            ))}
          </div>
        )}

        <div>
          {appointmentsData && (
            <TablePagination
              showInfo={false}
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

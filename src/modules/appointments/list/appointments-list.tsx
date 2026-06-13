"use client";

import { Calendar } from "@/components/ui/calendar";
import { SectionHeader } from "@/components/customs/secction-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserPlusIcon } from "lucide-react";
import { routes } from "@/lib";
import { DialogWrapper } from "@/components/customs/dialog-wrapper";
import { useState } from "react";
import { isSameDay } from "date-fns";
import { AppointmentDetails } from "../details/appointments-details";

export interface Appointment {
  id: string;

  patient: AppointmentPatient;

  doctor: AppointmentDoctor;

  appointmentDateTime: string;

  durationMinutes: number;

  consultationReason: string;

  status: AppointmentStatus;

  cancellationReason?: string;

  createdAt: string;

  confirmedAt?: string;

  attendedAt?: string;

  notes?: string;
}

export interface AppointmentPatient {
  id: string;
  fullName: string;
  documentNumber: string;
  phone: string;
}

export interface AppointmentDoctor {
  id: string;
  fullName: string;
  specialty: string;
}

export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "ATTENDED"
  | "CANCELLED"
  | "NO_SHOW";

export function AppointmentsList() {
  const router = useRouter();

  const [openDetails, setOpenDetails] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const appointments: Appointment[] = [
    {
      id: "1",

      patient: {
        id: "1",
        fullName: "Juan Pérez",
        documentNumber: "12345678",
        phone: "555111111",
      },

      doctor: {
        id: "1",
        fullName: "Dr. García",
        specialty: "Cardiología",
      },

      appointmentDateTime: "2026-06-13T09:00:00",

      durationMinutes: 30,

      consultationReason: "Dolor en el pecho",

      status: "CONFIRMED",

      createdAt: "2026-06-10T08:00:00",

      notes: "Paciente recurrente",
    },

    {
      id: "2",

      patient: {
        id: "2",
        fullName: "María López",
        documentNumber: "87654321",
        phone: "555222222",
      },

      doctor: {
        id: "1",
        fullName: "Dr. García",
        specialty: "Cardiología",
      },

      appointmentDateTime: "2026-06-13T10:00:00",

      durationMinutes: 30,

      consultationReason: "Chequeo general",

      status: "SCHEDULED",

      createdAt: "2026-06-10T08:30:00",

      notes: "",
    },
  ];

  const appointmentsForSelectedDay = appointments.filter((appointment) =>
    selectedDate
      ? isSameDay(new Date(appointment.appointmentDateTime), selectedDate)
      : false
  );

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
                  setSelectedDate(date);
                  setSelectedAppointment(null);
                }}
              />
            </div>

            {/*  <div className="flex w-1/3">
              <div className="rounded-lg border border-border w-full py-2 px-4">
                <p> Descripcion de la cita </p>
                <p> Datos relevantes </p>
                <p> Hora y demas datos </p>
              </div>
            </div> */}
            <div className="w-1/3 border border-border rounded-lg p-4">
              {appointmentsForSelectedDay.map((appointment) => (
                <button
                  key={appointment.id}
                  className="w-full border border-border rounded-md p-2 mb-2 text-left"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setOpenDetails(true);
                  }}
                >
                  <div>
                    {new Date(
                      appointment.appointmentDateTime
                    ).toLocaleTimeString("es", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  <div>{appointment.patient.fullName}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

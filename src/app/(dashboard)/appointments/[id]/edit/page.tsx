import { APPOINTMENT_STATUS } from "@/lib";
import { AppointmentForm } from "@/modules/appointments/forms/appointment-form";
import { findAppointmentById } from "@/modules/appointments/services";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const response = await findAppointmentById(id);

  return (
    <AppointmentForm
      mode="edit"
      appointment={{
        id: response.data.id,
        appointmentDateTime: response.data.appointmentDateTime,
        durationMinutes: response.data.durationMinutes,
        consultationReason: response.data.consultationReason,
        status: response.data.status as APPOINTMENT_STATUS,
        cancelledBy: response.data.cancelledBy,
        cancellationReason: response.data.cancellationReason,
        createdBy: response.data.createdBy,
        createdAt: response.data.createdAt,
        confirmedAt: response.data.confirmedAt,
        attendedAt: response.data.attendedAt,
        notes: response.data.notes,
        patientFullName: response.data.patientFullName,
        doctorFullName: response.data.doctorFullName,
      }}
    />
  );
}

import { APPOINTMENT_STATUS } from "@/lib";
import { AppointmentForm } from "@/modules/appointments/forms/appointment-form";
import { findAppointmentById } from "@/modules/appointments/services";
import { findUserById } from "@/modules/user/services";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const response = await findAppointmentById(id);
  const user = await findUserById(response.data.createdBy);
  const userCancelledAppointment = response.data.cancelledBy ? await findUserById(response.data.cancelledBy) : undefined;

  return (
    <AppointmentForm
      mode="details"
      appointment={{
        id: response.data.id,
        appointmentDateTime: response.data.appointmentDateTime,
        durationMinutes: response.data.durationMinutes,
        consultationReason: response.data.consultationReason,
        status: response.data.status as APPOINTMENT_STATUS,
        cancelledBy: userCancelledAppointment?.data.username,
        cancellationReason: response.data.cancellationReason,
        createdBy: user.data.username,
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

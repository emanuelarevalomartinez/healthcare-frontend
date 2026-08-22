import { APPOINTMENT_STATUS } from "@/lib";
import { AppointmentForm } from "@/modules/appointments/forms/appointment-form";

export default async function Page() {
  return (
    <AppointmentForm
     mode="create"
     appointment={{
       id: "",
        appointmentDateTime: "",
        durationMinutes: 0,
        consultationReason: "",
        status: undefined as unknown as APPOINTMENT_STATUS,
        cancelledBy: "",
        cancellationReason: "",
        createdBy: "",
        createdAt: "",
        confirmedAt: "",
        attendedAt: "",
        notes: "",
        patientFullName: "",
        doctorFullName: "",
     }}
    />
  );
}

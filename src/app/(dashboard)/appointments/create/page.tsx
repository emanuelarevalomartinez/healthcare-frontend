import { APPOINTMENT_STATUS } from "@/lib";
import { AppointmentForm } from "@/modules/appointments/forms/appointment-form";
import { PATIENT_DOCUMENT_TYPE } from "@/modules/patients/types";

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
        medicalRecordNumber: "",
        documentType: undefined as unknown as PATIENT_DOCUMENT_TYPE,
        patientFullName: "",
        doctorFullName: "",
     }}
    />
  );
}

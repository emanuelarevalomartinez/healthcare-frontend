import { ConsultationForm } from "@/modules/consultations/forms/consultation-form";

export default async function Page() {
  return (
    <ConsultationForm
      mode="create"
      consultation={{
        id: "",
        consultationName: "",
        symptoms: "",
        diagnosis: "",
        treatment: "",
        prescription: "",
        observations: "",
        consultationDate: "",
        nextReview: "",
        registrationDate: "",
        appointmentName: "",
        appointmentDateTime: "",
        doctorName: "",
        patientName: "",
      }}
    />
  );
}

import { ConsultationForm } from "@/modules/consultations/forms/consultation-form";

export default async function Page() {
  return (
    <ConsultationForm
      mode="create"
      consultation={{
        id: "",
        symptoms: "",
        diagnosis: "",
        treatment: "",
        prescription: "",
        observations: "",
        consultationDate: "",
        nextReview: "",
        registrationDate: "",
        doctorName: "",
        patientName: "",
      }}
    />
  );
}

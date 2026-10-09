import { ConsultationForm } from "@/modules/consultations/forms/consultation-form";
import { findConsultationById } from "@/modules/consultations/services";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const response = await findConsultationById(id);

  return (
    <ConsultationForm
      mode="details"
      consultation={{
        id: response.data.id,
        consultationName: response.data.consultationName,
        symptoms: response.data.symptoms,
        diagnosis: response.data.diagnosis,
        treatment: response.data.treatment,
        prescription: response.data.prescription,
        observations: response.data.observations,
        consultationDate: response.data.consultationDate,
        nextReview: response.data.nextReview,
        registrationDate: response.data.registrationDate,
        appointmentName: response.data.appointmentName,
        appointmentDateTime: response.data.appointmentDateTime,
        doctorName: response.data.doctorName,
        patientName: response.data.patientName,
      }}
    />
  );
}

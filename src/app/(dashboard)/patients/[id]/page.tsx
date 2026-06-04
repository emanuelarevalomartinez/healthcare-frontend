import { PatientForm } from "@/modules/patients/forms/patient-form";
import { findPatientById } from "@/modules/patients/services";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ({ params }: PageProps) {
  const { id } = await params;

  console.log("id", id);

  const response = await findPatientById(id);

  console.log("response.data", response.data);

  return (
    <PatientForm
      mode="details"
      patient={{
        id: response.data.id,
        medicalRecordNumber: response.data.medicalRecordNumber,
        fullName: response.data.fullName,
        documentType: response.data.documentType,
        documentNumber: response.data.documentNumber,
        birthDate: response.data.birthDate,
        sex: response.data.sex,
        phone: response.data.phone,
        email: response.data.email,
        address: response.data.address,
        notes: response.data.notes,
        createdById: response.data.createdById,
        createdAt: response.data.createdAt,
      }}
    />
  );
}

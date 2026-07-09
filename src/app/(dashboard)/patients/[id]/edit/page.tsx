import { PatientForm } from "@/modules/patients/forms/patient-form";
import { findPatientById } from "@/modules/patients/services";
import { findUserById } from "@/modules/user/services";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const response = await findPatientById(id);
  const user = await findUserById(response.data.createdById);

  return (
    <PatientForm
      mode="edit"
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
        createdById: user.data.username,
        createdAt: response.data.createdAt,
      }}
    />
  );
}

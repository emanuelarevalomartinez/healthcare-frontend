import { PatientForm } from "@/modules/patients/forms/patient-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewPatientPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <PatientForm
        patient={{
          id: "",
          medicalRecordNumber: "",
          fullName: "",
          documentType: "",
          documentNumber: "",
          birthDate: new Date(),
          sex: "",
          phone: "",
          email: "",
          address: "",
          notes: "",
          createdById: "",
          createdAt: new Date(),
        }}
      />
    </div>
  );
}

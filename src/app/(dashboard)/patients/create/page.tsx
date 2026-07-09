import { PatientForm } from "@/modules/patients/forms/patient-form";

export default async function Page() {
  return (
    <div>
      <PatientForm
        mode="create"
        patient={{
          id: "",
          medicalRecordNumber: "",
          fullName: "",
          documentType: "",
          documentNumber: "",
          birthDate: "",
          sex: "",
          phone: "",
          email: "",
          address: "",
          notes: "",
          createdById: "",
          createdAt: undefined as unknown as string,
        }}
      />
    </div>
  );
}

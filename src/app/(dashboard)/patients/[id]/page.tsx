import { PatientForm } from "@/modules/patients/forms/patient-form";

export default async function () {
  return (
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
  );
}

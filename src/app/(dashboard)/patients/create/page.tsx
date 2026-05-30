import { PatientForm } from "@/modules/patients/forms/patient-form";

interface PageProps {
  params: Promise<{ id: string }>; // En Next.js 14/15/16 params es asíncrono
}

export default async function NewPatientPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <PatientForm />
    </div>
  );
}
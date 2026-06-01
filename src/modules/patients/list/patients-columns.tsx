import { TableColumn } from "@/components/customs/table-wrapper";
import { PatientApiResponse } from "../types";

  export const getPatientColumns = (t: any): TableColumn<PatientApiResponse>[] => [
  {
    header: t.medicalRecordNumberLabel,
    accessor: "medicalRecordNumber",
  },
  {
    header: t.fullNameLabel,
    accessor: "fullName",
  },
  {
    header: t.phoneLabel,
    accessor: "phone",
  },
  {
    header: t.registrationDateLabel,
    accessor: (patient) => new Date(patient.createdAt).toLocaleDateString(),
  },
];
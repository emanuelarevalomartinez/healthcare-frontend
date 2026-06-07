import { TableColumn } from "@/components/customs/table-wrapper";
import { PatientApiResponse } from "../types";
import { TranslationDictionary } from "@/lib";

export const getPatientColumns = (
  dictionary: TranslationDictionary
): TableColumn<PatientApiResponse>[] => {
  const t = dictionary.dashboard.patients;

  return [
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
};

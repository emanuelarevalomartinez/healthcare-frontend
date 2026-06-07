import { TableColumn } from "@/components/customs/table-wrapper";
import { PatientApiResponse } from "../types";
import { TranslationDictionary } from "@/lib";
import { formatDisplayDateTimeToLocaleString } from "@/lib/utils/functions";

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
      accessor: (patient) => formatDisplayDateTimeToLocaleString(patient.createdAt),
    },
  ];
};

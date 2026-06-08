import { TableColumn } from "@/components/customs/table-wrapper";
import { TranslationDictionary } from "@/lib";
import { DoctorApiResponse } from "../types";


export const getDoctorColumns = (
  dictionary: TranslationDictionary
): TableColumn<DoctorApiResponse>[] => {
  const t = dictionary.dashboard.doctors;

  return [
    {
      header: t.specialty,
      accessor: "specialty",
    },
    {
      header: t.licenseNumber,
      accessor: "licenseNumber",
    },
    {
      header: t.defaultConsultationDuration,
      accessor: "defaultConsultationDuration",
    },
   /*  {
      header: t.registrationDateLabel,
      accessor: (user) => formatDisplayDateTimeToLocaleString(user.createdAt),
    }, */
  ];
};
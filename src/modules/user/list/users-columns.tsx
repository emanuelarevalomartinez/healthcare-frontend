import { TableColumn } from "@/components/customs/table-wrapper";
import { UserApiResponse } from "../types";
import { TranslationDictionary } from "@/lib";
import { formatDisplayDateTimeToLocaleString } from "@/lib/utils/functions";

export const getUserColumns = (
  dictionary: TranslationDictionary
): TableColumn<UserApiResponse>[] => {
  const t = dictionary.dashboard.users;

  return [
    {
      header: t.userName,
      accessor: "username",
    },
    {
      header: t.email,
      accessor: "email",
    },
    {
      header: t.role,
      accessor: "role",
    },
    {
      header: t.registrationDateLabel,
      accessor: (user) => formatDisplayDateTimeToLocaleString(user.createdAt),
    },
  ];
};

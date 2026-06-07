"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes, TranslationDictionary } from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import { TableAction } from "@/components/customs/table-wrapper";
import { UserApiResponse } from "../types";
import { deleteUser, getAllUsers } from "../services";

interface UsePatientsActionsProps {
  dictionary: TranslationDictionary;
}

export function useUsersActions({ dictionary }: UsePatientsActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.users;

  const [usersData, setUsersData] =
    useState<PaginatedData<UserApiResponse>>();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const pageSize = 10;

  const fetchUsers = useCallback(async () => {
    setIsTableLoading(true);
    try {
      const response = await getAllUsers(currentPage, pageSize);
      setUsersData(response.data);
    } catch (error) {
      console.error("Error to load the users: ", error);
    } finally {
      setIsTableLoading(false);
    }
  }, [currentPage, pageSize]);

  const handleOpenDeleteConfirm = (id: string, username: string) => {
    setUserToDelete({ id, username });
    setIsAlertOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!userToDelete) return;
    try {
      const response = await deleteUser(userToDelete.id);
      if (response.status === 200 || response.status === 204) {
        toast.success(t.successDeleteUserToast);
        if (usersData?.content.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          await fetchUsers();
        }
      }
    } catch (error) {
      console.error("Error to delete:", error);
      toast.error(t.errordeleteUserToast);
    } finally {
      setIsAlertOpen(false);
      setUserToDelete(null);
    }
  };

  const usersActions: TableAction<UserApiResponse>[] = [
    {
      label: dictionary.components.actions.viewDetails,
      onClick: (e) => router.push(routes.users.details.replace(":id", e.id)),
    },
    {
      label: dictionary.components.actions.edit,
      onClick: (e) => router.push(routes.users.edit.replace(":id", e.id)),
    },
    {
      label: dictionary.components.actions.delete,
      variant: "destructive",
      separatorBefore: true,
      onClick: (e) => handleOpenDeleteConfirm(e.id, e.username),
    },
  ];

/*   const getDocumentTypeOptions = useCallback((optionsDict: any) => {
    return Object.values(PATIENT_DOCUMENT_TYPE).map((docType) => {
      const docTypeKey = docType.toLowerCase() as
        | "dni"
        | "passport"
        | "id_card"
        | "other";
      return { value: docType, label: optionsDict[docTypeKey] };
    });
  }, []); */

 /*  const getSexOptions = useCallback((optionsDict: any) => {
    return Object.values(PATIENT_SEX).map((sexItem) => {
      const sexKey = sexItem.toLowerCase() as "male" | "female" | "other";
      return { value: sexItem, label: optionsDict[sexKey] };
    });
  }, []); */

  return {
    usersData,
    isAlertOpen,
    setIsAlertOpen,
    currentPage,
    setCurrentPage,
    userToDelete,
    setUserToDelete,
    isTableLoading,
    usersActions,
    fetchUsers,
    handleExecuteDelete,
  //  getDocumentTypeOptions,
   // getSexOptions,
  };
}

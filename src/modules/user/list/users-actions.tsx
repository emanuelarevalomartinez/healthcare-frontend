"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes, TranslationDictionary, USER_ROLE } from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import { TableAction } from "@/components/customs/table-wrapper";
import { UserApiResponse, UserUpdateRequest } from "../types";
import { deleteUser, getAllUsers, updateUser } from "../services";
import { getUserDataLocalStore } from "@/lib/utils/local-storage";

interface UsePatientsActionsProps {
  dictionary: TranslationDictionary;
}

export function useUsersActions({ dictionary }: UsePatientsActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.users;

  const user = getUserDataLocalStore();
  const currentUserId = user?.id;

  const [usersData, setUsersData] = useState<PaginatedData<UserApiResponse>>();
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

  const handleActivateUser = async (id: string, isActive: boolean) => {
    try {
      const userUpdate: UserUpdateRequest = {
        isActive: !isActive,
      };

      const response = await updateUser(id, userUpdate);

      if (response.status === 200 || response.status === 204) {
        const updatedUser = response.data;

        setUsersData((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            content: prev.content.map((user) =>
              user.id === updatedUser.id ? updatedUser : user
            ),
          };
        });

        toast.success(
          isActive ? t.successDeactivateUserToast : t.successActivateUserToast
        );
      }
    } catch (error) {
      console.error("Error to activate:", error);
      toast.error(
        isActive ? t.errorDeactivateUserToast : t.errorActivateUserToast
      );
    }
  };

  const usersActions: TableAction<UserApiResponse>[] = [
    {
      label: dictionary.components.actions.viewDetails,
      onClick: (e) => router.push(routes.users.details.replace(":id", e.id)),
    },
    {
      label: (user) =>
        user.isActive
          ? dictionary.components.actions.deactivate
          : dictionary.components.actions.activate,
      onClick: (user) => {
        console.log(user.isActive);
        handleActivateUser(user.id, user.isActive);
      },
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
      disabled: (user) => user.id === currentUserId,
    },
  ];

  const getRoleOptions = useCallback((optionsDict: any) => {
    return Object.values(USER_ROLE).map((sexItem) => {
      const sexKey = sexItem.toLowerCase() as
        | "admin"
        | "doctor"
        | "receptionist";
      return { value: sexItem, label: optionsDict[sexKey] };
    });
  }, []);

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
    getRoleOptions,
  };
}

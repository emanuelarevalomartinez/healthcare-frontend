"use client";

import { TranslationDictionary } from "@/lib";
import { getUserDataLocalStore } from "@/lib/utils/local-storage";
import { findMyUser } from "@/modules/auth/services";
import { UserApiResponse } from "@/modules/user/types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UseDoctorsActionsProps {
  dictionary: TranslationDictionary;
}

export function useDoctorsActions({ dictionary }: UseDoctorsActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.doctors;

  const user = getUserDataLocalStore();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [doctorToDelete, setDoctorToDelete] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const pageSize = 10;

  const [userData, setUserData] = useState<UserApiResponse>();

  const fetchMyUser = useCallback(async () => {
    setIsTableLoading(true);
    try {
      if (user) {
        const response = await findMyUser();
        console.log("response", response.data.doctor)
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error to load the users: ", error);
    } finally {
      setIsTableLoading(false);
    }
  }, [currentPage, pageSize]);

  return {
    isAlertOpen,
    setIsAlertOpen,
    currentPage,
    setCurrentPage,
    doctorToDelete,
    setDoctorToDelete,
    isTableLoading,
    fetchMyUser,
  };
}

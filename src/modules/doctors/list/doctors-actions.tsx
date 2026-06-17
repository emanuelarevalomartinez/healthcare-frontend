"use client";

import { TranslationDictionary } from "@/lib";
import { getUserDataLocalStore } from "@/lib/utils/local-storage";
import { findMyUser } from "@/modules/auth/services";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { DoctorApiResponse } from "../types";

interface UseDoctorsActionsProps {
  dictionary: TranslationDictionary;
}

export function useDoctorsActions({ dictionary }: UseDoctorsActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.doctors;

  const user = getUserDataLocalStore();

  const [doctorData, setDoctorData] = useState<DoctorApiResponse | null>(null);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [isNewDoctor, setIsNewDoctor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState(true);

  /*  const fetchMyUser = useCallback(async () => {
    try {
    //  if (!user) return;

      const response = await findMyUser();

      setUserData(response.data);

      const doctor = response.data?.doctor;

      if (doctor && doctor.createdBy === user?.id) {
        setCanCreateDoctor(true);
      } else {
        setCanCreateDoctor(false);
      }
    } catch (error) {
      console.error("Error to load the users: ", error);
    }
  }, [user]); */

  const fetchMyUser = async () => {
    try {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const response = await findMyUser();

      const doctor = response.data?.doctor;
      setDoctorData(doctor);

      if (!doctor) {
        setShowDoctorForm(true);
        setIsNewDoctor(true);
        return;
      }

      if (doctor.modifiedBy !== user.id) {
        setShowDoctorForm(true);
        setIsNewDoctor(false);
        return;
      }

      setShowDoctorForm(false);
    } catch (error) {
      console.error("Error to load the users: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    doctorData,
    showDoctorForm,
    isLoading,
    fetchMyUser,
    isNewDoctor,
    openDetails,
    setOpenDetails
  };
}

"use client";

import { TranslationDictionary } from "@/lib";
import {
  getUserDataLocalStore,
  setUserDataLocalStore,
} from "@/lib/utils/local-storage";
import { findMyUser } from "@/modules/auth/services";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const fetchMyUser = async () => {
    if (!user?.doctorProfileCompleted) {
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
        user.doctorProfileCompleted = true;
        setUserDataLocalStore(user);
      } catch (error) {
        console.error("Error to load the users: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    doctorData,
    showDoctorForm,
    isLoading,
    fetchMyUser,
    isNewDoctor,
    openDetails,
    setOpenDetails,
  };
}

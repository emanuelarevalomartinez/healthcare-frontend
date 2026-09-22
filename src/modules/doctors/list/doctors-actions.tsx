"use client";

import { DOCTOR_SCHEDULE_DAY_OF_WEEK, TranslationDictionary } from "@/lib";
import {
  getUserDataLocalStore,
  setUserDataLocalStore,
} from "@/lib/utils/local-storage";
import { findMyUser } from "@/modules/auth/services";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { UserWithDoctorandScheduleApiResponse } from "@/modules/user/types";

interface UseDoctorsActionsProps {
  dictionary: TranslationDictionary;
}

export function useDoctorsActions({ dictionary }: UseDoctorsActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.doctors;

  const user = getUserDataLocalStore();

  const [doctorWithUserAndScheduleData, setDoctorWithUserAndScheduleData] = useState<UserWithDoctorandScheduleApiResponse | null>(null);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [isNewDoctor, setIsNewDoctor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState(true);

   const getDoctorScheduleDaysOfWeekTypeOptions = useCallback(
        (optionsDict: any) => {
          return Object.values(DOCTOR_SCHEDULE_DAY_OF_WEEK).map(
            (docScheduleType) => {
              const docScheduleTypeKey = docScheduleType.toLowerCase() as
                | "all_week"
                | "weekdays"
                | "weekend"
                | "monday"
                | "tuesday"
                | "wednesday"
                | "thursday"
                | "friday"
                | "saturday"
                | "sunday";
              return {
                value: docScheduleType,
                label: optionsDict[docScheduleTypeKey],
              };
            }
          );
        },
        []
      );

  const fetchMyUser = async () => {
    if (!user?.doctorProfileCompleted) {
      try {
        if (!user) {
          setIsLoading(false);
          return;
        }

        const response = await findMyUser();

        const doctor = response.data?.doctor;
       setDoctorWithUserAndScheduleData(response.data);

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
    doctorWithUserAndScheduleData,
    showDoctorForm,
    isLoading,
    fetchMyUser,
    isNewDoctor,
    openDetails,
    setOpenDetails,
    getDoctorScheduleDaysOfWeekTypeOptions,
  };
}

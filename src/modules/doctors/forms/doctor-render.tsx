"use client";

import { useLanguage, USER_ROLE } from "@/lib";
import { getUserDataLocalStore } from "@/lib/utils/local-storage";
import { DoctorForm } from "./doctor-form";
import { useEffect } from "react";
import { useDoctorsActions } from "../list/doctors-actions";

export function DoctorRender() {
  const { dictionary } = useLanguage();
  const { fetchMyUser, showDoctorForm, isLoading, isNewDoctor, doctorData, openDetails, setOpenDetails } = useDoctorsActions({
    dictionary,
  });

  const user = getUserDataLocalStore();

  useEffect(() => {
    fetchMyUser();
  }, []);

    if (user?.role !== USER_ROLE.DOCTOR) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  if (!showDoctorForm) {
    return null;
  }

  return <DoctorForm mode={isNewDoctor ? "create": "complete"} doctorData={doctorData} openDetails={openDetails} setOpenDetails={setOpenDetails} />;
}

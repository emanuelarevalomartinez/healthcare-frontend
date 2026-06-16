"use client"

import { useLanguage, USER_ROLE } from "@/lib";
import { getUserDataLocalStore } from "@/lib/utils/local-storage";
import { DoctorForm } from "./doctor-form";
import { useEffect } from "react";
import { useDoctorsActions } from "../list/doctors-actions";


export function DoctorRender(){

  const { dictionary } = useLanguage();
  const { fetchMyUser } = useDoctorsActions({ dictionary });

   const user = getUserDataLocalStore();

  if (user?.role !== USER_ROLE.DOCTOR) {
    return null;
  } else {
    //const response = await findDoctorById('');
  }

  useEffect(() => {
    fetchMyUser();
  }, [])
  

  return <DoctorForm />;
}
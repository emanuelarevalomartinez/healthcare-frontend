"use client";

import { DialogWrapper } from "@/components/customs/dialog-wrapper";
import { useState } from "react";
import { ItemDoctorForm } from "./item-doctor-form";
import { DoctorFormMode, useLanguage } from "@/lib";
import { DoctorApiResponse } from "../types";

interface Props {
  mode: DoctorFormMode;
  openDetails: boolean;
  setOpenDetails: (e: boolean) => void;
  doctorData: DoctorApiResponse | null;
}

export function DoctorForm({ mode, doctorData, openDetails, setOpenDetails }: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.doctors;

  const title = mode === "create" ? t.createProfileTitle : t.completeProfileTitle;
  const description = mode === "create" ? t.createProfileDescription : t.completeProfileDescription;

  return (
    <>
      <DialogWrapper
        open={openDetails}
        onOpenChange={setOpenDetails}
        title={title}
        description={description}
        className="sm:min-w-xl"
        showCloseButton={false}
        preventOutsideClose
      >
        <ItemDoctorForm mode={mode} doctorData={doctorData} setOpenDetails={setOpenDetails} />
      </DialogWrapper>
    </>
  );
}

"use client";

import { DialogWrapper } from "@/components/customs/dialog-wrapper";
import { useState } from "react";
import { ItemDoctorForm } from "./item-doctor-form";
import { DoctorFormMode, useLanguage } from "@/lib";
import { DoctorApiResponse } from "../types";

interface Props {
  mode: DoctorFormMode;
  doctorData: DoctorApiResponse | null;
}

export function DoctorForm({ mode, doctorData }: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.doctors;
  const [openDetails, setOpenDetails] = useState(true);

  // TODO esto es para no cerrar el modal hasta que se termine con el formulario
  // preventOutsideClose

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
      >
        <ItemDoctorForm mode={mode} doctorData={doctorData} />
      </DialogWrapper>
    </>
  );
}

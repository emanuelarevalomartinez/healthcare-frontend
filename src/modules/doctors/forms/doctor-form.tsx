"use client";

import { DialogWrapper } from "@/components/customs/dialog-wrapper";
import { ItemDoctorForm } from "./item-doctor-form";
import { DOCTOR_SCHEDULE_DAY_OF_WEEK, DoctorFormMode, useLanguage } from "@/lib";
import { UserWithDoctorandScheduleApiResponse } from "@/modules/user/types";

interface Props {
  mode: DoctorFormMode;
  openDetails: boolean;
  setOpenDetails: (e: boolean) => void;
  doctorWithUserAndScheduleData: UserWithDoctorandScheduleApiResponse | null;
  getDoctorScheduleDaysOfWeekTypeOptions : (e: any) => {
    value: DOCTOR_SCHEDULE_DAY_OF_WEEK;
    label: any;
}[]
}

export function DoctorForm({ mode, doctorWithUserAndScheduleData, openDetails, setOpenDetails, getDoctorScheduleDaysOfWeekTypeOptions }: Props) {
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
        className="sm:min-w-1/2 overflow-y-scroll"
        showCloseButton={false}
        preventOutsideClose
      >
        <ItemDoctorForm mode={mode} doctorWithUserAndScheduleData={doctorWithUserAndScheduleData} setOpenDetails={setOpenDetails} getDoctorScheduleDaysOfWeekTypeOptions={getDoctorScheduleDaysOfWeekTypeOptions} />
      </DialogWrapper>
    </>
  );
}

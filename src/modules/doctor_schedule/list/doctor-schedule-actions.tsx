/* "use client";

import { TranslationDictionary } from "@/lib";
import { useCallback, useMemo, useState } from "react";
import { DoctorScheduleApiResponse } from "../types";


interface UseDoctorScheduleActionsProps {
  dictionary: TranslationDictionary;
}

export type DayOfWeek =
  | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY"
  | "FRIDAY" | "SATURDAY" | "SUNDAY";



export function useDoctorScheduleActions({ dictionary }: UseDoctorScheduleActionsProps) {

    const t = dictionary.dashboard.doctorSchedule;

   const ALL_DAYS: DayOfWeek[] = [
  "MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY",
];
const WEEKEND: DayOfWeek[] = ["SATURDAY","SUNDAY"];

  const [schedules, setSchedules] = useState<DoctorScheduleApiResponse[] | null>(null);

  const usedDays = useMemo(
    () => new Set(schedules.map((s) => s.dayOfWeek)),
    [schedules]
  );

  const availableDays = useMemo(
    () => ALL_DAYS.filter((d) => !usedDays.has(d)),
    [usedDays]
  );

  const addSchedule = useCallback((schedule: DoctorScheduleApiResponse) => {
    setSchedules((prev) => {
      if (prev.some((s) => s.dayOfWeek === schedule.dayOfWeek)) return prev;
      return [...prev, schedule];
    });
  }, []);

  const addManySchedules = useCallback((list: DoctorScheduleApiResponse[]) => {
    setSchedules((prev) => {
      const existing = new Set(prev.map((s) => s.dayOfWeek));
      const next = [...prev];
      for (const item of list) {
        if (!existing.has(item.dayOfWeek)) {
          next.push(item);
          existing.add(item.dayOfWeek);
        }
      }
      return next;
    });
  }, []);

  const updateSchedule = useCallback((index: number, patch: Partial<DoctorScheduleApiResponse>) => {
    setSchedules((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
    );
  }, []);

  const removeSchedule = useCallback((index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    schedules,
    setSchedules,
    usedDays,
    availableDays,
    addSchedule,
    addManySchedules,
    updateSchedule,
    removeSchedule,
    ALL_DAYS,
    WEEKEND,
  };
}
 */
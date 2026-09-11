"use client";

import { useCallback, useMemo, useState } from "react";
import { Trash2, Plus, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldSelect } from "@/components/customs/form-field-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DOCTOR_SCHEDULE_DAY_OF_WEEK, useLanguage } from "@/lib";
import { DoctorScheduleSchema, getCreateDoctorScheduleSchema } from "./schema";

export type DayOfWeek =
  | "ALL_WEEK"
  | "WEEKDAYS"
  | "WEEKEND"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface DoctorScheduleFormValue {
  id?: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  available: boolean;
  notes: string;
}

type FormMode = "create" | "edit" | "details";

const ALL_DAYS: DayOfWeek[] = [
  "ALL_WEEK",
  "WEEKDAYS",
  "WEEKEND",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const WEEKEND: DayOfWeek[] = ["SATURDAY", "SUNDAY"];

const DAY_LABELS: Record<DayOfWeek, string> = {
  ALL_WEEK: "Toda la semana",
  WEEKDAYS: "Lunes a viernes",
  WEEKEND: "Fin de semana",
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const STATIC_SCHEDULES: DoctorScheduleFormValue[] = [
  {
    id: "aebe2f6f-dc12-4bda-97fa-5058195f0e4b",
    dayOfWeek: "MONDAY",
    startTime: "08:00",
    endTime: "12:00",
    available: true,
    notes: "Consultas matutinas",
  },
  {
    id: "b1be2f6f-dc12-4bda-97fa-5058195f0e4c",
    dayOfWeek: "WEDNESDAY",
    startTime: "14:00",
    endTime: "18:00",
    available: true,
    notes: "",
  },
];

const EMPTY_DRAFT: DoctorScheduleFormValue = {
  dayOfWeek: "MONDAY",
  startTime: "09:00",
  endTime: "17:00",
  available: true,
  notes: "",
};

interface DoctorSchedulesManagerProps {
  initialSchedules?: DoctorScheduleFormValue[];
  mode?: FormMode;
  onChange?: (schedules: DoctorScheduleFormValue[]) => void;
}

export function DoctorSchedulesManager({
  initialSchedules = STATIC_SCHEDULES,
  mode = "create",
  onChange,
}: DoctorSchedulesManagerProps) {
  const disabled = mode === "details";

  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.doctorSchedule;

  const [schedules, setSchedules] =
    useState<DoctorScheduleFormValue[]>(initialSchedules);

  const [draft, setDraft] = useState<DoctorScheduleFormValue>(EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);

  const usedDays = useMemo(
    () => new Set(schedules.map((s) => s.dayOfWeek)),
    [schedules]
  );

  const availableDays = useMemo(
    () => ALL_DAYS.filter((d) => !usedDays.has(d)),
    [usedDays]
  );

  const commit = (next: DoctorScheduleFormValue[]) => {
    setSchedules(next);
    onChange?.(next);
    return next;
  };

  const resetDraftFor = (list: DoctorScheduleFormValue[]) => {
    const nextAvailable = ALL_DAYS.filter(
      (d) => !list.some((s) => s.dayOfWeek === d)
    );
    setDraft({
      ...EMPTY_DRAFT,
      dayOfWeek: nextAvailable[0] ?? "MONDAY",
    });
  };

  const handleAdd = () => {
    setError(null);

    if (!draft.dayOfWeek) {
      setError("Selecciona un día.");
      return;
    }
    if (draft.startTime >= draft.endTime) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }
    if (schedules.some((s) => s.dayOfWeek === draft.dayOfWeek)) {
      setError("Ya existe un horario para este día.");
      return;
    }

    const next = commit([...schedules, { ...draft }]);
    resetDraftFor(next);
  };

  /*  const currentSchema = useMemo(() => {
      return isEditMode
        ? getUpdatePatientSchema(dictionary)
        : getCreatePatientSchema(dictionary);
    }, [isEditMode, dictionary]); */

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

  const doctorScheduleTypeOptions = useMemo(
    () =>
      getDoctorScheduleDaysOfWeekTypeOptions(t.doctorScheduleDayOfWeekOptions),
    [t.doctorScheduleDayOfWeekOptions, getDoctorScheduleDaysOfWeekTypeOptions]
  );

  const currentSchema = useMemo(() => {
    return getCreateDoctorScheduleSchema(dictionary);
  }, [dictionary]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<DoctorScheduleSchema>({
    resolver: zodResolver(currentSchema),
    defaultValues: {},
  });

  const currentDaysOfWeekType = watch("currentDaysOfWeekType");

  return (
    <div className="md:col-span-2 space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4" />
        <h3 className="font-medium">Horarios de consulta</h3>
      </div>

      {/* Formulario nuevo bloque */}
      {!disabled && availableDays.length > 0 && (
        <Card className="border-dashed border-border bg-background">
          <CardContent className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 place-content-between">

            <div className="row-start-1 md:row-start-auto md:col-span-4 grid gap-2">
              <FormFieldSelect
                id="daysOfWeek"
                label={"label"}
                placeholder={"placeholder"}
                disabled={false}
                value={currentDaysOfWeekType}
                onValueChange={(value) =>
                  setValue(
                    "currentDaysOfWeekType",
                    value as DOCTOR_SCHEDULE_DAY_OF_WEEK,
                    {
                      shouldValidate: true,
                    }
                  )
                }
                options={doctorScheduleTypeOptions}
                error={errors.currentDaysOfWeekType?.message as string}
              />
            </div>

            <div className="row-start-2 md:row-start-auto md:col-span-3 grid gap-2">
              <Label>Hora de inicio</Label>
              <Input
                type="time"
                value={draft.startTime}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, startTime: e.target.value }))
                }
              />
            </div>

            <div className="row-start-3 md:row-start-auto md:col-span-3 grid gap-2">
              <Label>Hora de fin</Label>
              <Input
                type="time"
                value={draft.endTime}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, endTime: e.target.value }))
                }
              />
            </div>

            <div className="row-start-4 md:row-start-auto md:col-span-2 grid gap-2">
              <Label>Disponible</Label>
              <Switch
                checked={draft.available}
                onCheckedChange={(v) =>
                  setDraft((d) => ({ ...d, available: v }))
                }
              />
            </div>

            {error && (
              <p className="row-start-4 md:row-start-auto md:col-span-12 text-sm text-red-500">
                {error}
              </p>
            )}

            <Textarea
              id="notes"
              className="row-start-5 md:row-start-2 col-span-12"
              placeholder={"placeholder"}
              rows={4}
              disabled={false}
              /*   {...register("notes")} */
              /*  aria-invalid={errors.notes ? "true" : "false"} */
            />
          </CardContent>
        </Card>
      )}

      <Card className="bg-background">
        <CardContent>
          <div className="flex flex-col w-full">
            <Button type="button" onClick={handleAdd}>
              Añadir horario
            </Button>
          </div>
        </CardContent>
      </Card>

      {!disabled && availableDays.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Ya hay un horario para cada día de la semana.
        </p>
      )}
    </div>
  );
}

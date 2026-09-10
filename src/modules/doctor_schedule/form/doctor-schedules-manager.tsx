"use client";

import { useMemo, useState } from "react";
import { Trash2, Plus, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export type DayOfWeek =
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

  const handleRemove = (index: number) => {
    const next = commit(schedules.filter((_, i) => i !== index));
    resetDraftFor(next);
  };

  const handleUpdate = (
    index: number,
    patch: Partial<DoctorScheduleFormValue>
  ) => {
    const next = schedules.map((s, i) =>
      i === index ? { ...s, ...patch } : s
    );
    commit(next);
  };

  const handleSelectAllDays = () => {
    const nuevos: DoctorScheduleFormValue[] = ALL_DAYS.filter(
      (d) => !usedDays.has(d)
    ).map((d) => ({
      dayOfWeek: d,
      startTime: "09:00",
      endTime: "17:00",
      available: true,
      notes: "",
    }));
    const next = commit([...schedules, ...nuevos]);
    resetDraftFor(next);
  };

  const handleSelectWeekend = () => {
    const nuevos: DoctorScheduleFormValue[] = WEEKEND.filter(
      (d) => !usedDays.has(d)
    ).map((d) => ({
      dayOfWeek: d,
      startTime: "09:00",
      endTime: "13:00",
      available: true,
      notes: "",
    }));
    const next = commit([...schedules, ...nuevos]);
    resetDraftFor(next);
  };

  const toggleDayChip = (day: DayOfWeek) => {
    const exists = schedules.find((s) => s.dayOfWeek === day);
    if (exists) {
      handleRemove(schedules.indexOf(exists));
    } else {
      const nuevo: DoctorScheduleFormValue = {
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "17:00",
        available: true,
        notes: "",
      };
      const next = commit([...schedules, nuevo]);
      resetDraftFor(next);
    }
  };

  return (
    <div className="md:col-span-2 space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4" />
        <h3 className="font-medium">Horarios de consulta</h3>
      </div>

      {/* Atajos de selección */}
      {!disabled && (
        <>
          <div>
            <div className=" flex-col md:flex-row flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto"
                onClick={handleSelectAllDays}
              >
                Seleccionar todos los días
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto"
                onClick={handleSelectWeekend}
              >
                Fin de semana
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="">Días específicos:</span>

            {ALL_DAYS.map((day) => {
              const active = usedDays.has(day);
              return (
                <Button
                  key={day}
                  type="button"
                  className={`w-full md:w-auto shadow-sm text-xs border transition ${
                    active
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-background border-border hover:bg-primary"
                  }`}
                  onClick={() => toggleDayChip(day)}
                >
                  {DAY_LABELS[day]}
                </Button>
              );
            })}
          </div>
        </>
      )}

      {schedules.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay horarios registrados.
        </p>
      ) : (
        <div className="space-y-3">
          {schedules.map((s, index) => (
            <Card
              key={`${s.dayOfWeek}-${index}`}
              className="border-border bg-background"
            >
              <CardContent className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 items-end">
                <div className="md:col-span-2 grid gap-2">
                  <Label>Día</Label>
                  <Input disabled value={DAY_LABELS[s.dayOfWeek]} />
                </div>

                <div className="md:col-span-3 grid gap-2">
                  <Label>Hora de inicio</Label>
                  <Input
                    type="time"
                    value={s.startTime}
                    disabled={disabled}
                    onChange={(e) =>
                      handleUpdate(index, { startTime: e.target.value })
                    }
                  />
                </div>

                <div className="md:col-span-3 grid gap-2">
                  <Label>Hora de fin</Label>
                  <Input
                    type="time"
                    value={s.endTime}
                    disabled={disabled}
                    onChange={(e) =>
                      handleUpdate(index, { endTime: e.target.value })
                    }
                  />
                </div>

                <div className="md:col-span-2 grid gap-2">
                  <Label>Disponible</Label>
                  <Switch
                    checked={s.available}
                    disabled={disabled}
                    onCheckedChange={(v) =>
                      handleUpdate(index, { available: v })
                    }
                  />
                </div>

                {!disabled && (
                  <div className="md:col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}

                <Textarea
                  id="notes"
                  className="row-start-2 col-span-12"
                  placeholder={"placeholder"}
                  rows={4}
                  disabled={false}
                  /*   {...register("notes")} */
                  /*  aria-invalid={errors.notes ? "true" : "false"} */
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Formulario nuevo bloque */}
      {!disabled && availableDays.length > 0 && (
        <Card className="border-dashed border-border bg-background">
          <CardContent className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 items-end">
            <div className="md:col-span-2 grid gap-2">
              <Label>Día</Label>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={draft.dayOfWeek}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    dayOfWeek: e.target.value as DayOfWeek,
                  }))
                }
              >
                {availableDays.map((d) => (
                  <option key={d} value={d}>
                    {DAY_LABELS[d]}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 grid gap-2">
              <Label>Hora de inicio</Label>
              <Input
                type="time"
                value={draft.startTime}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, startTime: e.target.value }))
                }
              />
            </div>

            <div className="md:col-span-3 grid gap-2">
              <Label>Hora de fin</Label>
              <Input
                type="time"
                value={draft.endTime}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, endTime: e.target.value }))
                }
              />
            </div>

            <div className="md:col-span-2 grid gap-2">
              <Label>Disponible</Label>
              <Switch
                checked={draft.available}
                onCheckedChange={(v) =>
                  setDraft((d) => ({ ...d, available: v }))
                }
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="button" size="icon" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <p className="md:col-span-12 text-sm text-red-500">{error}</p>
            )}

            <Textarea
              id="notes"
              className="row-start-2 col-span-12"
              placeholder={"placeholder"}
              rows={4}
              disabled={false}
              /*   {...register("notes")} */
              /*  aria-invalid={errors.notes ? "true" : "false"} */
            />
          </CardContent>
        </Card>
      )}

      {!disabled && availableDays.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Ya hay un horario para cada día de la semana.
        </p>
      )}
    </div>
  );
}

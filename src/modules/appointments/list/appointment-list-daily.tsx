"use client";

import { ALERT_ACTION, APPOINTMENT_STATUS, useLanguage } from "@/lib";
import {
  formatDisplayDateTimeToLocaleString,
  formatSelectedDateToInputString,
  statusBadgeMap,
} from "@/lib/utils/functions";
import { AppointmentApiResponse } from "../types";
import { PaginatedData } from "@/lib/server/api-response";
import { BadgeWrapper } from "@/components/customs/badge-wrapper";
import { TablePagination } from "@/components/customs/table-pagination";
import { Loader2Icon, MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TableAction } from "@/components/customs/table-wrapper";
import { SystemAlertDialog } from "@/components/customs/system-alert-dialog";
import { Dispatch, SetStateAction } from "react";
import { DialogWrapper } from "@/components/customs/dialog-wrapper";
import { ItemAppointmentCancelForm } from "../forms/item-appointment-cancel-form";

interface Props {
  appointmentsData?: PaginatedData<AppointmentApiResponse>;
  appointmentDataToCancel: AppointmentApiResponse | null;
  selectedDate: Date;
  isLoading: boolean;
  setCurrentPage: (e: number) => void;
  actions?: TableAction<AppointmentApiResponse>[];
  handleExecuteDelete: () => Promise<void>;
  isCancelDialogWrapperOpen: boolean;
  setIsCancelDialogWrapperOpen: (e: boolean) => void;
  fetchAppointmentsFiltered: () => Promise<void>;
  alertActionType: ALERT_ACTION | null;
  handleCloseAlert: () => void;
  handleExecuteConfirm: () => Promise<void>;
}

export function AppointmentListDaily({
  appointmentsData,
  appointmentDataToCancel,
  selectedDate,
  isLoading,
  setCurrentPage,
  actions,
  handleExecuteDelete,
  isCancelDialogWrapperOpen,
  setIsCancelDialogWrapperOpen,
  fetchAppointmentsFiltered,
  alertActionType,
  handleCloseAlert,
  handleExecuteConfirm,
}: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.appointments;

  const appointments = appointmentsData?.content ?? [];
  const totalAppointments = appointmentsData?.totalElements ?? 0;
  const hasAppointments = appointments.length > 0;

  const getAppointmentStatusLabel = (status: APPOINTMENT_STATUS): string => {
    const statusKey =
      status.toLowerCase() as keyof typeof t.appointmentStatusOptions;

    return t.appointmentStatusOptions[statusKey];
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-[54vh] w-full">
      <Loader2Icon className="size-10 animate-spin text-primary mb-4" />

      <p className="text-sm text-muted-foreground animate-pulse">
        {dictionary.components.loading.text}
      </p>
    </div>
  );

  return (
    <>
      <div className="w-full rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">
            {t.appointmentsOn} {formatSelectedDateToInputString(selectedDate)}
          </h3>

          <span className="text-sm text-muted-foreground space-x-1">
            <span>{totalAppointments}</span>
            <span>
              {totalAppointments === 1
                ? t.appointmentCount
                : t.appointmentCountPlural}
            </span>
          </span>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : !hasAppointments ? (
          <div className="text-center place-content-center items-center py-8 text-muted-foreground h-[54vh]">
            {t.noAppointmentsForDay}
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto h-[52vh] rounded-md">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="relative w-full border border-border rounded-md p-3 mb-3 text-left"
              >
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {appointment.durationMinutes} {t.minutes}
                  </span>

                  {actions && actions.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 cursor-pointer"
                        >
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="bg-card" align="end">
                        {actions.map((action, actionIndex) => (
                          <div key={actionIndex}>
                            {action.separatorBefore && (
                              <DropdownMenuSeparator />
                            )}

                            <DropdownMenuItem
                              className="cursor-pointer"
                              disabled={action.disabled?.(appointment)}
                              variant={
                                action.variant === "destructive"
                                  ? "destructive"
                                  : "default"
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                action.onClick(appointment);
                              }}
                            >
                              {typeof action.label === "function"
                                ? action.label(appointment)
                                : action.label}
                            </DropdownMenuItem>
                          </div>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="pr-20">
                  <div className="font-medium">
                    {formatDisplayDateTimeToLocaleString(
                      appointment.appointmentDateTime
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {t.doctor}: {appointment.doctorFullName}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {t.patient}: {appointment.patientFullName}
                  </div>

                  <div className="mt-1">
                    <BadgeWrapper
                      type={
                        statusBadgeMap[appointment.status as APPOINTMENT_STATUS]
                      }
                    >
                      {getAppointmentStatusLabel(
                        appointment.status as APPOINTMENT_STATUS
                      )}
                    </BadgeWrapper>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {appointmentsData && (
          <TablePagination
            showInfo={false}
            page={appointmentsData.page}
            size={appointmentsData.size}
            totalElements={appointmentsData.totalElements}
            totalPages={appointmentsData.totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        )}
      </div>

      <SystemAlertDialog
        isOpen={alertActionType !== null}
        onClose={handleCloseAlert}
        onConfirm={
          alertActionType === ALERT_ACTION.DELETE
            ? handleExecuteDelete
            : handleExecuteConfirm
        }
        title={
          alertActionType === ALERT_ACTION.DELETE
            ? t.deleteAlertTitle
            : t.confirmAlertTitle
        }
        description={
          alertActionType === ALERT_ACTION.DELETE
            ? t.deleteAlertDescription
            : t.confirmAlertDescription
        }
        cancelText={t.cancel}
        confirmText={
          alertActionType === ALERT_ACTION.DELETE ? t.confirm : t.apply
        }
      />

      <DialogWrapper
        open={isCancelDialogWrapperOpen}
        onOpenChange={setIsCancelDialogWrapperOpen}
        title={t.cancelSectionTitle}
        description={t.cancelSectionSubtitle}
        className="sm:min-w-xl"
      >
        <ItemAppointmentCancelForm
          setOpenDetails={setIsCancelDialogWrapperOpen}
          appointmentData={appointmentDataToCancel}
          onSuccess={fetchAppointmentsFiltered}
        />
      </DialogWrapper>
    </>
  );
}

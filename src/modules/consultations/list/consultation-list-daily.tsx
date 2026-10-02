"use client";

import { SystemAlertDialog } from "@/components/customs/system-alert-dialog";
import { TablePagination } from "@/components/customs/table-pagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import {
  formatDisplayDateTimeToLocaleString,
  formatSelectedDateToInputString,
} from "@/lib/utils/functions";
import { Loader2Icon, MoreHorizontalIcon } from "lucide-react";
import { ConsultationApiResponse } from "../types";
import { TableAction } from "@/components/customs/table-wrapper";

interface Props {
  consultationsData?: PaginatedData<ConsultationApiResponse>;
  isAlertOpen: boolean;
  setIsAlertOpen: (e: boolean) => void;
  selectedDate?: Date;
  isLoading: boolean;
  setCurrentPage: (e: number) => void;
  actions?: TableAction<ConsultationApiResponse>[];
  handleExecuteDelete: () => Promise<void>;
  handleCloseAlert: () => void;
}

export function ConsultationListDaily({
  consultationsData,
  isAlertOpen,
  setIsAlertOpen,
  selectedDate,
  isLoading,
  setCurrentPage,
  actions,
  handleExecuteDelete,
  handleCloseAlert,
}: Props) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.consultations;

  const consultations = consultationsData?.content ?? [];
  const totalConsultations = consultationsData?.totalElements ?? 0;
  const hasConsultations = consultations.length > 0;

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-[80vh] w-full">
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
            {selectedDate
              ? formatSelectedDateToInputString(selectedDate)
              : t.searchResults}
          </h3>

          <span className="text-sm text-muted-foreground space-x-1">
            <span>{totalConsultations}</span>
            <span>
              {totalConsultations === 1
                ? t.consultationCount
                : t.consultationCountPlural}
            </span>
          </span>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : !hasConsultations ? (
          <div className="text-center place-content-center items-center py-8 text-muted-foreground h-[80vh]">
            {selectedDate ? t.noConsultasForDay : t.noConsultasFound}
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto h-[62vh] rounded-md">
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="relative w-full border border-border rounded-md p-3 mb-3 text-left"
              >
                <div className="absolute top-2 right-2 flex items-center gap-1">
                 {/*  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {consultation.durationMinutes} {t.minutes}
                  </span> */}

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
                              disabled={action.disabled?.(consultation)}
                              variant={
                                action.variant === "destructive"
                                  ? "destructive"
                                  : "default"
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                action.onClick(consultation);
                              }}
                            >
                              {typeof action.label === "function"
                                ? action.label(consultation)
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
                      consultation.consultationDate
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    llave: valor
                  </div>

                 {/*  <div className="text-sm text-muted-foreground">
                    {t.doctor}: {consultation.doctorFullName}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {t.patient}: {consultation.patientFullName}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {t.documentTypeLabel}: {consultation.documentType}
                  </div> */}

                  {/*  <div className="mt-1">
                            <BadgeWrapper
                              type={
                                statusBadgeMap[consultation.status as APPOINTMENT_STATUS]
                              }
                            >
                              {getAppointmentStatusLabel(
                                consultation.status as APPOINTMENT_STATUS
                              )}
                            </BadgeWrapper>
                          </div> */}
                </div>
              </div>
            ))}
          </div>
        )}

        {consultationsData && (
          <TablePagination
            showInfo={false}
            page={consultationsData.page}
            size={consultationsData.size}
            totalElements={consultationsData.totalElements}
            totalPages={consultationsData.totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        )}
      </div>

     {/*  <SystemAlertDialog
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
            /> */}

             <SystemAlertDialog
                    isOpen={isAlertOpen}
                    onClose={() => {
                      setIsAlertOpen(false);
                      handleCloseAlert();
                    }}
                    onConfirm={handleExecuteDelete}
                    title={t.deleteAlertTitle}
                    description={t.deleteAlertDescription}
                    cancelText={t.cancel}
                    confirmText={t.confirm}
                  />

     {/*  <DialogWrapper
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
      </DialogWrapper> */}
    </>
  );
}

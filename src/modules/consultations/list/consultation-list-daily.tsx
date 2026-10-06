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
                className="rounded-md border border-border px-3 py-2.5 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">
                    {formatDisplayDateTimeToLocaleString(
                      consultation.consultationDate
                    )}
                  </span>

                  {actions && actions.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 shrink-0 cursor-pointer"
                        >
                          <MoreHorizontalIcon className="size-4" />
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

                <div className="mt-2 space-y-1.5 border-t border-border pt-2">
                  <div className="text-sm">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {t.patient}
                    </span>
                    <p className="truncate">{consultation.patientName}</p>
                  </div>

                  <div className="text-sm">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {t.doctor}
                    </span>
                    <p className="truncate">{consultation.doctorName}</p>
                  </div>

                  <div className="text-sm">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {t.symptomsLabel}
                    </span>
                    <p className="line-clamp-2">{consultation.symptoms}</p>
                  </div>

                  <div className="text-sm">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {t.diagnosisLabel}
                    </span>
                    <p className="line-clamp-2">{consultation.diagnosis}</p>
                  </div>
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
    </>
  );
}

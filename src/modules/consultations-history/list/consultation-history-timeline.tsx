"use client";

import { Fragment, useEffect } from "react";
import { CalendarDaysIcon, Trash2Icon } from "lucide-react";
import { CONSULTATION_HISTORIES_EVENT_TYPE, useLanguage } from "@/lib";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/customs/secction-header";
import { TablePagination } from "@/components/customs/table-pagination";
import { SystemAlertDialog } from "@/components/customs/system-alert-dialog";
import { useConsultationHistoryActions } from "./consultation-history-actions";
import { BadgeWrapper } from "@/components/customs/badge-wrapper";
import {
  formatDisplayDateToLocaleDateString,
  statusConsultationHistoryMap,
} from "@/lib/utils/functions";

interface ConsultationHistoryTimelineProps {
  isAdmin: boolean;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="wrap-break-word text-sm font-medium">{value}</dd>
    </div>
  );
}

export function ConsultationHistoryTimeline({
  isAdmin,
}: ConsultationHistoryTimelineProps) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.consultationHistories;
  const eventTypes = t.eventTypes as Record<string, string>;

  const getConsultationHistoryStatusLabel = (
    status: CONSULTATION_HISTORIES_EVENT_TYPE
  ): string => {
    const statusKey = status.toLowerCase() as keyof typeof t.eventTypes;

    return t.eventTypes[statusKey];
  };

  const {
    data,
    isLoading,
    isDeleting,
    setCurrentPage,
    fetchHistories,
    deleteTarget,
    requestDeleteOne,
    requestDeleteByDate,
    closeDeleteDialog,
    confirmDelete,
  } = useConsultationHistoryActions({ dictionary });

  useEffect(() => {
    fetchHistories();
  }, [fetchHistories]);

  const groups = data?.content ?? [];

  const TimelineSkeleton = () => {
    return (
      <div className="ml-3 space-y-6 border-l-2 border-border pl-8">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6 p-1">
        <SectionHeader title={t.sectionTitle} description={t.sectionSubtitle} />

        {isLoading && groups.length === 0 ? (
          <TimelineSkeleton />
        ) : groups.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {t.empty}
          </p>
        ) : (
          <ol
            aria-busy={isLoading}
            className={`ml-3 border-l-2 border-border transition-opacity ${
              isLoading ? "opacity-60" : ""
            }`}
          >
            {groups.map((group) => {
              const dateLabel = formatDisplayDateToLocaleDateString(group.date);

              return (
                <Fragment key={group.date}>
                  <li className="relative pb-4 pl-8">
                    <span
                      aria-hidden
                      className="absolute -left-3.25 top-0 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground"
                    >
                      <CalendarDaysIcon className="size-3.5" />
                    </span>

                    <div className="flex flex-col md:flex-row items-center md:justify-between gap-3">
                      <h3 className="text-base font-semibold capitalize">
                        {dateLabel}
                      </h3>

                      {isAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            requestDeleteByDate(group.date, dateLabel)
                          }
                        >
                          <Trash2Icon className="mr-2 size-4" />
                          {t.deleteDayButton}
                        </Button>
                      )}
                    </div>
                  </li>
                  {group.histories.map((history) => {
                    const title = history.consultationName;

                    return (
                      <li key={history.id} className="relative pb-6 pl-8">
                        <span
                          aria-hidden
                          className="absolute -left-1.75 top-5 size-3 rounded-full border-2 border-background bg-primary ring-2 ring-primary/30"
                        />

                        <Card className="gap-0 py-0">
                          <CardContent className="space-y-4 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <time
                                  dateTime={history.registeredAt}
                                  className="text-sm font-semibold tabular-nums"
                                >
                                  {formatDisplayDateToLocaleDateString(
                                    history.registeredAt
                                  )}
                                </time>
                                <BadgeWrapper
                                  type={
                                    statusConsultationHistoryMap[
                                      history.eventType as CONSULTATION_HISTORIES_EVENT_TYPE
                                    ]
                                  }
                                >
                                  {getConsultationHistoryStatusLabel(
                                    history.eventType as CONSULTATION_HISTORIES_EVENT_TYPE
                                  )}
                                </BadgeWrapper>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 text-muted-foreground hover:text-destructive"
                                aria-label={`${t.deleteOneButton}: ${title}`}
                                onClick={() =>
                                  requestDeleteOne(
                                    history.id,
                                    `${title}"  ${
                                      t.deleteOneLabelConnector
                                    } " ${formatDisplayDateToLocaleDateString(
                                      history.registeredAt
                                    )}`
                                  )
                                }
                              >
                                {isAdmin && (
                                  <Trash2Icon className="text-destructive hover:text-destructive" />
                                )}
                              </Button>
                            </div>

                            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                              <Field
                                label={t.consultationLabel}
                                value={history.consultationName}
                              />
                              <Field
                                label={t.appointmentLabel}
                                value={history.appointmentName}
                              />
                              <Field
                                label={t.patientLabel}
                                value={history.patientName}
                              />
                              <Field
                                label={t.doctorLabel}
                                value={history.doctorName}
                              />
                              <Field
                                label={t.performedByLabel}
                                value={history.performedByUserName}
                              />
                              <Field
                                label={t.registeredAtLabel}
                                value={new Date(
                                  history.registeredAt
                                ).toLocaleString()}
                              />
                            </dl>
                          </CardContent>
                        </Card>
                      </li>
                    );
                  })}
                </Fragment>
              );
            })}
          </ol>
        )}

        {data && (
          <TablePagination
            page={data.page}
            size={data.size}
            totalElements={data.totalElements}
            totalPages={data.totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        )}
      </div>

      <SystemAlertDialog
        isOpen={!!deleteTarget}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title={
          deleteTarget?.type === "date"
            ? t.deleteDayAlertTitle
            : t.deleteOneAlertTitle
        }
        description={`${
          deleteTarget?.type === "date"
            ? t.deleteDayAlertDescription
            : t.deleteOneAlertDescription
        } "${deleteTarget?.label ?? ""}".`}
        cancelText={t.cancel}
        confirmText={isDeleting ? t.buttonLoading : t.confirm}
      />
    </>
  );
}

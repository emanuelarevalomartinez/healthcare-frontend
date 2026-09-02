"use client";

import { Calendar } from "@/components/ui/calendar";
import { SectionHeader } from "@/components/customs/secction-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserPlusIcon } from "lucide-react";
import { APPOINTMENT_STATUS, routes, useLanguage } from "@/lib";
import { useEffect, useState } from "react";
import { useAppointmentActions } from "./appointment-actions";
import { AppointmentListDaily } from "./appointment-list-daily";
import { AppointmentSearch } from "./appointment-search";
import { Card, CardContent } from "@/components/ui/card";

export function AppointmentsList() {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.appointments;
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<APPOINTMENT_STATUS | "ALL">(
    "ALL"
  );
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string | "ALL">(
    "ALL"
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleStatusFilter = (status: APPOINTMENT_STATUS | "ALL") => {
    setStatusFilter(status);
  };

  const handleDocumentTypeFilter = (docType: string | "ALL") => {
    setDocumentTypeFilter(docType);
  };

  const {
    appointmentsData,
    appointmentDataToCancel,
    setCurrentPage,
    selectedDate,
    setSelectedDate,
    fetchAppointmentsFiltered,
    isLoading,
    appointmentActions,
    handleExecuteDelete,
    isCancelDialogWrapperOpen,
    setIsCancelDialogWrapperOpen,
    alertActionType,
    handleCloseAlert,
    handleExecuteConfirm,
  } = useAppointmentActions({ dictionary });

  useEffect(() => {
    fetchAppointmentsFiltered();
  }, [fetchAppointmentsFiltered]);

    if (!selectedDate) {
    return null;
  }

  return (
    <>
      <div className="space-y-4 p-1">
        <div className="flex flex-col w-full">
          <div>
            <SectionHeader
              title={t.tableSectionTitle}
              description={t.tableSectionSubtitle}
            >
              <Button
                onClick={() => router.push(routes.appointments.create)}
                className="w-full sm:w-auto shadow-sm"
              >
                <UserPlusIcon className="mr-2 size-4" />
                {t.createNewAppointmentButton}
              </Button>
            </SectionHeader>
          </div>

          <div>
            <AppointmentSearch
              onSearch={handleSearch}
              onStatusFilter={handleStatusFilter}
              onDocumentTypeFilter={handleDocumentTypeFilter}
              initialSearchTerm={searchTerm}
              initialStatus={statusFilter}
              initialDocumentType={documentTypeFilter}
            />
          </div>

          <div className="grid grid-cols-1 2xl:flex 2xl:flex-row gap-2 pt-4">
            <Card className="row-start-2 flex w-full bg-transparent border border-border h-[62vh]">
              <CardContent>
                <AppointmentListDaily
                  actions={appointmentActions}
                  appointmentDataToCancel={appointmentDataToCancel}
                  appointmentsData={appointmentsData}
                  selectedDate={selectedDate}
                  isLoading={isLoading}
                  setCurrentPage={setCurrentPage}
                  handleExecuteDelete={handleExecuteDelete}
                  isCancelDialogWrapperOpen={isCancelDialogWrapperOpen}
                  setIsCancelDialogWrapperOpen={setIsCancelDialogWrapperOpen}
                  fetchAppointmentsFiltered={fetchAppointmentsFiltered}
                  alertActionType={alertActionType}
                  handleCloseAlert={handleCloseAlert}
                  handleExecuteConfirm={handleExecuteConfirm}
                />
              </CardContent>
            </Card>

            <Card className="row-start-1 flex w-full 2xl:w-4/12 bg-transparent border border-border h-auto overflow-y-auto">
              <CardContent>
                <Calendar
                  className="w-full rounded-lg"
                  captionLayout="dropdown"
                  buttonVariant="outline"
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

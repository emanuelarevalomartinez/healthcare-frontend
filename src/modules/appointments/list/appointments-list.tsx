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
    isAlertOpen,
    setIsAlertOpen,
    handleExecuteDelete,
    setAppointmentToDelete,
    isCancelDialogWrapperOpen,
    setIsCancelDialogWrapperOpen,
  } = useAppointmentActions({ dictionary });

  useEffect(() => {
    fetchAppointmentsFiltered();
  }, [fetchAppointmentsFiltered]);

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

          <div className="flex flex-col 2xl:flex-row gap-1 pt-4">
            <Card className="flex w-full 2xl:w-2/3 bg-transparent border border-border h-auto 2xl:h-[74vh] overflow-y-auto">
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

            <Card className="flex w-full 2xl:w-1/3 bg-transparent border border-border h-[74vh]">
              <CardContent>
                <AppointmentListDaily
                  actions={appointmentActions}
                  appointmentDataToCancel={appointmentDataToCancel}
                  appointmentsData={appointmentsData}
                  selectedDate={selectedDate}
                  isLoading={isLoading}
                  setCurrentPage={setCurrentPage}
                  isAlertOpen={isAlertOpen}
                  setIsAlertOpen={setIsAlertOpen}
                  handleExecuteDelete={handleExecuteDelete}
                  setAppointmentToDelete={setAppointmentToDelete}
                  isCancelDialogWrapperOpen={isCancelDialogWrapperOpen}
                  setIsCancelDialogWrapperOpen={setIsCancelDialogWrapperOpen}
                  fetchAppointmentsFiltered={fetchAppointmentsFiltered}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { Calendar } from "@/components/ui/calendar";
import { SectionHeader } from "@/components/customs/secction-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserPlusIcon } from "lucide-react";
import { routes, useLanguage } from "@/lib";
import { useEffect } from "react";
import { useAppointmentActions } from "./appointment-actions";
import { AppointmentListDaily } from "./appointment-list-daily";
import { AppointmentSearch } from "./appointment-search";
import { Card, CardContent } from "@/components/ui/card";

export function AppointmentsList() {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.appointments;
  const router = useRouter();

  const {
    appointmentsData,
    appointmentsSearchData,
    appointmentDataToCancel,
    setCurrentPage,
    selectedDate,
    setSelectedDate,
    isLoading,
    appointmentActions,
    handleExecuteDelete,
    isCancelDialogWrapperOpen,
    setIsCancelDialogWrapperOpen,
    alertActionType,
    handleCloseAlert,
    handleExecuteConfirm,
    searchTerm,
    setSearchTerm,
    fetchAppointments,
    isSearchView,
    statusFilter,
    setStatusFilter,
    documentTypeFilter,
    setDocumentTypeFilter,
    getAppointmentStatusOptions,
    getDocumentTypeStatusOptions,
    isFiltersVisible,
    setIsFiltersVisible
  } = useAppointmentActions({ dictionary });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    fetchAppointments(searchTerm);
  }, [fetchAppointments, searchTerm]);

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
              onStatusFilter={setStatusFilter}
              onDocumentTypeFilter={setDocumentTypeFilter}
              initialSearchTerm={searchTerm}
              status={statusFilter}
              documentType={documentTypeFilter}
              getAppointmentStatusOptions={getAppointmentStatusOptions}
              getDocumentTypeStatusOptions={getDocumentTypeStatusOptions}
              isFiltersVisible={isFiltersVisible}
              setIsFiltersVisible={setIsFiltersVisible}
            />
          </div>

          {searchTerm !== "" ? (
            <div className="flex gap-2 pt-4">
              <Card className="row-start-2 flex w-full bg-transparent border border-border h-[80vh]">
                <CardContent>
                  <AppointmentListDaily
                    actions={appointmentActions}
                    appointmentDataToCancel={appointmentDataToCancel}
                    appointmentsData={appointmentsSearchData}
                    isLoading={isLoading}
                    setCurrentPage={setCurrentPage}
                    handleExecuteDelete={handleExecuteDelete}
                    isCancelDialogWrapperOpen={isCancelDialogWrapperOpen}
                    setIsCancelDialogWrapperOpen={setIsCancelDialogWrapperOpen}
                    fetchAppointmentsFiltered={fetchAppointments}
                    alertActionType={alertActionType}
                    handleCloseAlert={handleCloseAlert}
                    handleExecuteConfirm={handleExecuteConfirm}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 2xl:flex 2xl:flex-row gap-2 pt-4">
              <Card className="row-start-2 flex w-full bg-transparent border border-border h-[80vh]">
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
                    fetchAppointmentsFiltered={fetchAppointments}
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
          )}
        </div>
      </div>
    </>
  );
}

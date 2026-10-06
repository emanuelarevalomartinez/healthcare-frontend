"use client";

import { SectionHeader } from "@/components/customs/secction-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { routes, useLanguage } from "@/lib";
import { UserPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConsultationListDaily } from "./consultation-list-daily";
import { useEffect, useState } from "react";
import { useConsultationActions } from "./consultation-actions";

export function ConsultationList() {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.consultations;
  const router = useRouter();

  const {
    selectedDate,
    handleDateChange,
    handleCloseAlert,
    isAlertOpen,
    setIsAlertOpen,
    consultationsData,
    isLoading,
    setCurrentPage,
    consultationsActions,
    handleExecuteDelete,
    fetchConsultations,
    searchTerm,
    setSearchTerm,
    consultationsSearchData
  } = useConsultationActions({
    dictionary,
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    fetchConsultations(searchTerm);
  }, [fetchConsultations, searchTerm]);

  if (!selectedDate) {
    return null;
  }

  const isSearching = searchTerm !== "";

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
                onClick={() => router.push(routes.consultations.create)}
                className="w-full sm:w-auto shadow-sm"
              >
                <UserPlusIcon className="mr-2 size-4" />
                {t.createNewConsultationButton}
              </Button>
            </SectionHeader>
          </div>

          {/*   <div>
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
              </div> */}

          <div className="grid grid-cols-1 2xl:flex 2xl:flex-row gap-2 pt-4">
            <Card className="row-start-2 flex w-full bg-transparent border border-border h-[80vh]">
              <CardContent>
                <ConsultationListDaily
                  consultationsData={
                    isSearching ? consultationsSearchData : consultationsData
                  }
                  isAlertOpen={isAlertOpen}
                  setIsAlertOpen={setIsAlertOpen}
                  selectedDate={isSearching ? undefined : selectedDate}
                  isLoading={isLoading}
                  setCurrentPage={setCurrentPage}
                  actions={consultationsActions}
                  handleExecuteDelete={handleExecuteDelete}
                  handleCloseAlert={handleCloseAlert}
                />
              </CardContent>
            </Card>

            {!isSearching && (
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
                        handleDateChange(date);
                      }
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

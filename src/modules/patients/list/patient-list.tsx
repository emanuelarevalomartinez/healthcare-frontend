"use client";

import { useEffect } from "react";
import { TableWrapper } from "@/components/customs/table-wrapper";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import { SectionHeader } from "@/components/customs/secction-header";
import { TablePagination } from "@/components/customs/table-pagination";
import { useRouter } from "next/navigation";
import { routes, useLanguage } from "@/lib";
import { SystemAlertDialog } from "@/components/customs/system-alert-dialog";
import { getPatientColumns } from "./patients-columns";
import { usePatientsActions } from "./patients-actions";
import { PatientSearch } from "./patient-search";

export function PatientList() {
  const router = useRouter();
  const { dictionary } = useLanguage();
  const columns = getPatientColumns(dictionary);
  const t = dictionary.dashboard.patients;

  const {
    patientsData,
    isAlertOpen,
    setIsAlertOpen,
    setCurrentPage,
    patientToDelete,
    setPatientToDelete,
    isTableLoading,
    patientActions,
    fetchPatients,
    handleExecuteDelete,
    searchTerm,
    setSearchTerm,
    isSearchView,
    sexTypeFilter,
    setSexTypeFilter,
    documentTypeFilter,
    getDocumentTypeOptions,
    setDocumentTypeFilter,
    isFiltersVisible,
    setIsFiltersVisible,
    getSexOptions,
    patientsSearchData,
  } = usePatientsActions({ dictionary });

  useEffect(() => {
    fetchPatients(searchTerm);
  }, [fetchPatients, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const activeData = isSearchView ? patientsSearchData : patientsData;

  return (
    <>
      <div className="space-y-4 p-1">
        <SectionHeader
          title={t.tableSectionTitle}
          description={t.tableSectionSubtitle}
        >
          <Button
            onClick={() => router.push(routes.patients.create)}
            className="w-full sm:w-auto shadow-sm"
          >
            <UserPlusIcon className="mr-2 size-4" />
            {t.createNewPatientButton}
          </Button>
        </SectionHeader>

        <div>
          <PatientSearch
            onSearch={handleSearch}
            onSexFilter={setSexTypeFilter}
            onDocumentTypeFilter={setDocumentTypeFilter}
            initialSearchTerm={searchTerm}
            sexType={sexTypeFilter}
            documentType={documentTypeFilter}
            getSexOptions={getSexOptions}
            getDocumentTypeStatusOptions={getDocumentTypeOptions}
            isFiltersVisible={isFiltersVisible}
            setIsFiltersVisible={setIsFiltersVisible}
          />
        </div>

        <div>
          <TableWrapper
            cols={columns}
            data={activeData?.content || []}
            actions={patientActions}
            isLoading={isTableLoading}
          />

          {activeData && (
            <TablePagination
              page={activeData.page}
              size={activeData.size}
              totalElements={activeData.totalElements}
              totalPages={activeData.totalPages}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />
          )}
        </div>
      </div>

      <SystemAlertDialog
        isOpen={isAlertOpen}
        onClose={() => {
          setIsAlertOpen(false);
          setPatientToDelete(null);
        }}
        onConfirm={handleExecuteDelete}
        title={t.deleteAlertTitle}
        description={`${t.deleteAlertDescription} ${
          patientToDelete?.name ? `"${patientToDelete.name}"` : ""
        }.`}
        cancelText={t.cancel}
        confirmText={t.confirm}
      />
    </>
  );
}

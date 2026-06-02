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
import { usePatientsActions } from "./patients-actions";
import { getPatientColumns } from "./patients-columns";

export function PatientList() {
  const router = useRouter();
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.patients;
  const columns = getPatientColumns(t);

  const {
    patients,
    isAlertOpen,
    setIsAlertOpen,
    currentPage,
    setCurrentPage,
    patientToDelete,
    setPatientToDelete,
    isLoading,
    patientActions,
    fetchPatients,
    handleExecuteDelete,
  } = usePatientsActions(dictionary);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleGoToCreatePatient = () => {
    router.push(routes.patients.create);
  };

  return (
    <>
      <div className="space-y-4 p-1">
        <SectionHeader title={t.tableSectionTitle} description={t.tableSectionSubtitle}>
          <Button onClick={handleGoToCreatePatient} className="w-full sm:w-auto shadow-sm">
            <UserPlusIcon className="mr-2 size-4" />
            {t.createNewPatientButton}
          </Button>
        </SectionHeader>
        
        <div>
          <TableWrapper
            cols={columns}
            data={patients?.content || []}
            actions={patientActions}
            isLoading={isLoading}
          />
        </div>
        
        {patients && (
          <TablePagination
            page={patients.page}
            size={patients.size}
            totalElements={patients.totalElements}
            totalPages={patients.totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        )}
      </div>

      <SystemAlertDialog
        isOpen={isAlertOpen}
        onClose={() => {
          setIsAlertOpen(false);
          setPatientToDelete(null);
        }}
        onConfirm={handleExecuteDelete}
        title={t.deleteAlertTitle}
        description={`${t.deleteAlertDescription} ${patientToDelete?.name ? `"${patientToDelete.name}"` : ""}.`}
        cancelText={t.cancel}
        confirmText={t.confirm}
      />
    </>
  );
}
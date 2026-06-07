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
  } = usePatientsActions({ dictionary });

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

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

        <TableWrapper
          cols={columns}
          data={patientsData?.content || []}
          actions={patientActions}
          isLoading={isTableLoading}
        />

        {patientsData && (
          <TablePagination
            page={patientsData.page}
            size={patientsData.size}
            totalElements={patientsData.totalElements}
            totalPages={patientsData.totalPages}
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
        description={`${t.deleteAlertDescription} ${
          patientToDelete?.name ? `"${patientToDelete.name}"` : ""
        }.`}
        cancelText={t.cancel}
        confirmText={t.confirm}
      />
    </>
  );
}

'use client'

import { SectionHeader } from "@/components/customs/secction-header";
import { SystemAlertDialog } from "@/components/customs/system-alert-dialog";
import { TablePagination } from "@/components/customs/table-pagination";
import { TableWrapper } from "@/components/customs/table-wrapper";
import { Button } from "@/components/ui/button";
import { routes, useLanguage } from "@/lib";
import { UserPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDoctorsActions } from "./doctors-actions";
import { useEffect } from "react";
import { getDoctorColumns } from "./doctors-columns";

export function DoctorsList(){

    const router = useRouter();
      const { dictionary } = useLanguage();
      const columns = getDoctorColumns(dictionary);
      const t = dictionary.dashboard.doctors;
    
      const {
        doctorsData,
        isAlertOpen,
        setIsAlertOpen,
        setCurrentPage,
        doctorToDelete,
        setDoctorToDelete,
        isTableLoading,
        doctorsActions,
        fetchDoctors,
        handleExecuteDelete,
      } = useDoctorsActions({ dictionary });
    
      useEffect(() => {
        fetchDoctors();
      }, [fetchDoctors]);

  return(
    <>
      <div className="space-y-4 p-1">
        <SectionHeader
          title={t.tableSectionTitle}
          description={t.tableSectionSubtitle}
        >
          <Button
            onClick={() => router.push(routes.doctors.create)}
            className="w-full sm:w-auto shadow-sm"
          >
            <UserPlusIcon className="mr-2 size-4" />
            {t.createNewDoctorButton}
          </Button>
        </SectionHeader>

        <TableWrapper
          cols={columns}
          data={doctorsData?.content || []}
          actions={doctorsActions}
          isLoading={isTableLoading}
        />

        {doctorsData && (
          <TablePagination
            page={doctorsData.page}
            size={doctorsData.size}
            totalElements={doctorsData.totalElements}
            totalPages={doctorsData.totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        )}
      </div>

      <SystemAlertDialog
        isOpen={isAlertOpen}
        onClose={() => {
          setIsAlertOpen(false);
          setDoctorToDelete(null);
        }}
        onConfirm={handleExecuteDelete}
        title={t.deleteAlertTitle}
        description={`${t.deleteAlertDescription} ${
          doctorToDelete?.username ? `"${doctorToDelete.username}"` : ""
        }.`}
        cancelText={t.cancel}
        confirmText={t.confirm}
      />
    </>
  )

}
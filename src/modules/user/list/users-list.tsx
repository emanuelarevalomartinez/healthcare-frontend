"use client";

import { SectionHeader } from "@/components/customs/secction-header";
import { SystemAlertDialog } from "@/components/customs/system-alert-dialog";
import { TablePagination } from "@/components/customs/table-pagination";
import { TableWrapper } from "@/components/customs/table-wrapper";
import { Button } from "@/components/ui/button";
import { routes, useLanguage } from "@/lib";
import { UserPlusIcon } from "lucide-react";
import { useEffect } from "react";
import { getUserColumns } from "./users-columns";
import { useUsersActions } from "./users-actions";
import { useRouter } from "next/navigation";

export function UserList() {
  const router = useRouter();
  const { dictionary } = useLanguage();
  const columns = getUserColumns(dictionary);
  const t = dictionary.dashboard.users;

  const {
    usersData,
    isAlertOpen,
    setIsAlertOpen,
    setCurrentPage,
    userToDelete,
    setUserToDelete,
    isTableLoading,
    usersActions,
    fetchUsers,
    handleExecuteDelete,
  } = useUsersActions({ dictionary });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <div className="space-y-4 p-1">
        <SectionHeader
          title={t.tableSectionTitle}
          description={t.tableSectionSubtitle}
        >
          <Button
            onClick={() => router.push(routes.users.create)}
            className="w-full sm:w-auto shadow-sm"
          >
            <UserPlusIcon className="mr-2 size-4" />
            {t.createNewUserButton}
          </Button>
        </SectionHeader>

        <TableWrapper
          cols={columns}
          data={usersData?.content || []}
          actions={usersActions}
          isLoading={isTableLoading}
        />

        {usersData && (
          <TablePagination
            page={usersData.page}
            size={usersData.size}
            totalElements={usersData.totalElements}
            totalPages={usersData.totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        )}
      </div>

      <SystemAlertDialog
        isOpen={isAlertOpen}
        onClose={() => {
          setIsAlertOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleExecuteDelete}
        title={t.deleteAlertTitle}
        description={`${t.deleteAlertDescription} ${
          userToDelete?.username ? `"${userToDelete.username}"` : ""
        }.`}
        cancelText={t.cancel}
        confirmText={t.confirm}
      />
    </>
  );
}

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
import { UserSearch } from "./user-search";

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
    searchTerm,
    setSearchTerm,
    userRoleTypeFilter,
    setUserRoleTypeFilter,
    getRoleOptions,
    isFiltersVisible,
    setIsFiltersVisible,
    currentActive,
    setCurrentActive,
    usersSearchData,
    isSearchView,
  } = useUsersActions({ dictionary });

  useEffect(() => {
    fetchUsers(searchTerm);
  }, [fetchUsers, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const activeData = isSearchView ? usersSearchData : usersData;

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

        <div>
          <UserSearch
            onSearch={handleSearch}
            onUserRoleTypeFilter={setUserRoleTypeFilter}
            initialSearchTerm={searchTerm}
            userRoleType={userRoleTypeFilter}
            getUserRoleOptions={getRoleOptions}
            isFiltersVisible={isFiltersVisible}
            setIsFiltersVisible={setIsFiltersVisible}
            currentActive={currentActive}
            setCurrentActive={setCurrentActive}
          />
        </div>

        <div>
          <TableWrapper
            cols={columns}
            data={activeData?.content || []}
            actions={usersActions}
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

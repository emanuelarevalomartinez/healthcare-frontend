"use client";

import { FormFieldSelect } from "@/components/customs/form-field-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useLanguage, USER_ROLE } from "@/lib";
import { Filter, Search, X } from "lucide-react";
import { useMemo } from "react";

interface UserSearchProps {
  onSearch?: (searchTerm: string) => void;
  onUserRoleTypeFilter?: (status: USER_ROLE | undefined) => void;
  initialSearchTerm?: string;
  userRoleType?: string | undefined;
  getUserRoleOptions: (optionsDict: any) => {
    value: USER_ROLE;
    label: any;
  }[];
  isFiltersVisible: boolean;
  setIsFiltersVisible: (e: boolean) => void;
  currentActive: boolean;
  setCurrentActive: (e: boolean) => void;
}

export function UserSearch({
  onSearch,
  onUserRoleTypeFilter,
  initialSearchTerm,
  userRoleType,
  getUserRoleOptions,
  isFiltersVisible,
  setIsFiltersVisible,
  currentActive,
  setCurrentActive,
}: UserSearchProps) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.users;

  const handleSearch = (value: string) => {
    onSearch?.(value);
  };

  const clearUserRoleFilter = () => {
    onUserRoleTypeFilter?.(undefined);
  };

  const userRoleStatusOptions = useMemo(
    () => getUserRoleOptions(t.roleOptions),
    [t.roleOptions, getUserRoleOptions]
  );

  const activeFiltersCount = useMemo(
    () => (isFiltersVisible ? 1 + (userRoleType !== undefined ? 1 : 0) : 0),
    [isFiltersVisible, userRoleType]
  );

  return (
    <div className={`space-y-4`}>
      <div className="flex flex-1 items-center gap-4 mt-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.searchPlaceholder}
            value={initialSearchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-12 pl-9 bg-background border-muted"
          />
          {initialSearchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          variant={isFiltersVisible ? "default" : "outline"}
          size="default"
          className="h-12 gap-2"
          onClick={() => {
            if (isFiltersVisible) {
              onUserRoleTypeFilter?.(undefined);
            }
            setIsFiltersVisible(!isFiltersVisible);
          }}
        >
          <Filter className="h-4 w-4" />
          {t.filters}
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-2 py-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>
      {isFiltersVisible && (
        <div className="flex flex-col lg:flex-row flex-wrap gap-2 px-4 pt-4 pb-4 lg:pb-0 border border-border rounded-lg bg-muted/30">
          <div className={`lg:w-[30%] w-full`}>
            <FormFieldSelect
              id="sex"
              label={t.roleLabel}
              placeholder={t.rolePlaceholder}
              value={userRoleType ?? ""}
              onValueChange={(value) => {
                const status = value as USER_ROLE | undefined;
                onUserRoleTypeFilter?.(status);
              }}
              options={userRoleStatusOptions}
            />
          </div>

          {userRoleType !== undefined && (
            <div className="flex lg:items-center lg:place-content-center mb-1 ml-1">
              <Button
                variant="destructive"
                size="default"
                onClick={clearUserRoleFilter}
                className="w-full lg:w-auto"
              >
                <X />
                {t.clear}
              </Button>
            </div>
          )}

          <div className="pl-0 lg:pl-4">
            <FieldLabel htmlFor="active">
              {currentActive ? t.activeUserLabel : t.inactiveUserLabel}
            </FieldLabel>

            <Switch
              id="active"
              size="default"
              className="mt-0 lg:mt-2"
              checked={currentActive}
              onCheckedChange={(checked) => setCurrentActive(checked)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

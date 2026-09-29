"use client";

import { FormFieldSelect } from "@/components/customs/form-field-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib";
import { Filter, Search, X } from "lucide-react";
import { useMemo } from "react";
import { PATIENT_DOCUMENT_TYPE, PATIENT_SEX } from "../types";

interface PatientSearchProps {
  onSearch?: (searchTerm: string) => void;
  onSexFilter?: (status: PATIENT_SEX | undefined) => void;
  onDocumentTypeFilter?: (
    documentType: PATIENT_DOCUMENT_TYPE | undefined
  ) => void;
  initialSearchTerm?: string;
  sexType?: string | undefined;
  documentType?: string | undefined;
  getDocumentTypeStatusOptions: (optionsDict: any) => {
    value: PATIENT_DOCUMENT_TYPE;
    label: any;
  }[];
  getSexOptions: (optionsDict: any) => {
    value: PATIENT_SEX;
    label: any;
  }[];
  isFiltersVisible: boolean;
  setIsFiltersVisible: (e: boolean) => void;
}

export function PatientSearch({
  onSearch,
  onSexFilter,
  onDocumentTypeFilter,
  initialSearchTerm,
  sexType,
  documentType,
  getSexOptions,
  getDocumentTypeStatusOptions,
  isFiltersVisible,
  setIsFiltersVisible,
}: PatientSearchProps) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.patients;

  const handleSearch = (value: string) => {
    onSearch?.(value);
  };

  const clearSexFilter = () => {
    onSexFilter?.(undefined);
  };

  const clearDocumentTypeFilter = () => {
    onDocumentTypeFilter?.(undefined);
  };

  const sexStatusOptions = useMemo(
    () => getSexOptions(t.sexTypeOptions),
    [t.sexTypeOptions, getSexOptions]
  );

  const documentTypeStatusOptions = useMemo(
    () => getDocumentTypeStatusOptions(t.documentTypeOptions),
    [t.documentTypeOptions, getDocumentTypeStatusOptions]
  );

  const activeFiltersCount = useMemo(
    () =>
      [sexType !== undefined, documentType !== undefined].filter(Boolean)
        .length,
    [sexType, documentType]
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
              onDocumentTypeFilter?.(undefined);
              onSexFilter?.(undefined);
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
              label={t.sexLabel}
              placeholder={t.sexTypePlaceholder}
              value={sexType ?? ""}
              onValueChange={(value) => {
                const status = value as PATIENT_SEX | undefined;
                onSexFilter?.(status);
              }}
              options={sexStatusOptions}
            />
          </div>

          {sexType !== undefined && (
            <div className="flex lg:items-center lg:place-content-center mb-1 ml-1">
              <Button
                variant="destructive"
                size="default"
                onClick={clearSexFilter}
                className="w-full lg:w-auto"
              >
                <X />
                {t.clear}
              </Button>
            </div>
          )}

          <div className={`lg:w-[38%] w-full`}>
            <FormFieldSelect
              id="documentType"
              label={t.documentTypeLabel}
              placeholder={t.documentTypePlaceholder}
              value={documentType ?? ""}
              onValueChange={(value) => {
                const docType = value as PATIENT_DOCUMENT_TYPE | undefined;
                onDocumentTypeFilter?.(docType);
              }}
              options={documentTypeStatusOptions}
            />
          </div>

          {documentType !== undefined && (
            <div className="flex lg:items-center lg:place-content-center mb-1 ml-1">
              <Button
                variant="destructive"
                size="default"
                onClick={clearDocumentTypeFilter}
                className="w-full lg:w-auto"
              >
                <X />
                {t.clear}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

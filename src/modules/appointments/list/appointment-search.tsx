import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCallback, useMemo, useState } from "react";
import { useLanguage } from "@/lib";
import { APPOINTMENT_STATUS } from "@/lib";
import { FormFieldSelect } from "@/components/customs/form-field-select";
import { PATIENT_DOCUMENT_TYPE } from "@/modules/patients/types";

interface AppointmentSearchProps {
  onSearch?: (searchTerm: string) => void;
  onStatusFilter?: (status: APPOINTMENT_STATUS | undefined) => void;
  onDocumentTypeFilter?: (
    documentType: PATIENT_DOCUMENT_TYPE | undefined
  ) => void;
  initialSearchTerm?: string;
  status?: APPOINTMENT_STATUS | undefined;
  documentType?: string | undefined;
  getAppointmentStatusOptions: (optionsDict: any) => {
    value: APPOINTMENT_STATUS;
    label: any;
  }[];
  getDocumentTypeStatusOptions: (optionsDict: any) => {
    value: PATIENT_DOCUMENT_TYPE;
    label: any;
  }[];
  isFiltersVisible: boolean;
  setIsFiltersVisible: (e: boolean) => void;
}

export function AppointmentSearch({
  onSearch,
  onStatusFilter,
  onDocumentTypeFilter,
  initialSearchTerm,
  status,
  documentType,
  getAppointmentStatusOptions,
  getDocumentTypeStatusOptions,
  isFiltersVisible,
  setIsFiltersVisible
}: AppointmentSearchProps) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.appointments;

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const clearStatusFilter = () => {
    onStatusFilter?.(undefined);
  };

  const clearDocumentTypeFilter = () => {
    onDocumentTypeFilter?.(undefined);
  };

  const appointmentStatusOptions = useMemo(
    () => getAppointmentStatusOptions(t.appointmentStatusOptions),
    [t.appointmentStatusOptions, getAppointmentStatusOptions]
  );

  const documentTypeStatusOptions = useMemo(
    () => getDocumentTypeStatusOptions(t.documentTypeOptions),
    [t.documentTypeOptions, getDocumentTypeStatusOptions]
  );

  const hasActiveFilters =
    status !== undefined || documentType !== undefined || searchTerm !== "";

  return (
    <div className={`space-y-4`}>
      <div className="flex flex-1 items-center gap-4 mt-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={"Buscar por paciente, doctor o documento"}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-12 pl-9 bg-background border-muted"
          />
          {searchTerm && (
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
              onStatusFilter?.(undefined);
              onDocumentTypeFilter?.(undefined);
            }
            setIsFiltersVisible(!isFiltersVisible);
          }}
        >
          <Filter className="h-4 w-4" />
          {t.filters}
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 px-2 py-0 text-xs">
              {[
                status !== undefined ? 1 : 0,
                documentType !== undefined ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </Badge>
          )}
        </Button>
      </div>
      {isFiltersVisible && (
        <div className="flex flex-col lg:flex-row flex-wrap gap-2 px-4 pt-4 pb-4 lg:pb-0 border border-border rounded-lg bg-muted/30">
          <div className={`lg:w-[30%] w-full`}>
            <FormFieldSelect
              id="appointmentStatus"
              label={t.statusLabel}
              placeholder={t.statusPlaceholder}
              value={status ?? ""}
              onValueChange={(value) => {
                const status = value as APPOINTMENT_STATUS | undefined;
                onStatusFilter?.(status);
              }}
              options={appointmentStatusOptions}
            />
          </div>

          {status !== undefined && (
            <div className="flex lg:items-center lg:place-content-center mb-1 ml-1">
              <Button
                variant="destructive"
                size="default"
                onClick={clearStatusFilter}
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

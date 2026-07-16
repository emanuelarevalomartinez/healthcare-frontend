
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useLanguage } from "@/lib";
import { APPOINTMENT_STATUS } from "@/lib";

interface AppointmentSearchProps {
  onSearch?: (searchTerm: string) => void;
  onStatusFilter?: (status: APPOINTMENT_STATUS | "ALL") => void;
  onDocumentTypeFilter?: (documentType: string | "ALL") => void;
  initialSearchTerm?: string;
  initialStatus?: APPOINTMENT_STATUS | "ALL";
  initialDocumentType?: string | "ALL";
  className?: string;
}

const documentTypes = [
  "ALL",
  "CEDULA",
  "PASAPORTE",
  "RUC",
  "CEDULA_EXTRANJERA",
  "NIT",
] as const;

const statusOptions = [
  { value: "ALL", label: "Todos" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "SCHEDULED", label: "Agendada" },
  { value: "ATTENDED", label: "Atendida" },
  { value: "CANCELLED", label: "Cancelada" },
  { value: "NO_SHOW", label: "No Asistió" },
] as const;

export function AppointmentSearch({
  onSearch,
  onStatusFilter,
  onDocumentTypeFilter,
  initialSearchTerm = "",
  initialStatus = "ALL",
  initialDocumentType = "ALL",
  className = "",
}: AppointmentSearchProps) {
  const { dictionary } = useLanguage();
  const t = dictionary.dashboard.appointments;

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedStatus, setSelectedStatus] = useState<APPOINTMENT_STATUS | "ALL">(initialStatus);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | "ALL">(initialDocumentType);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleStatusChange = (value: string) => {
    const status = value as APPOINTMENT_STATUS | "ALL";
    setSelectedStatus(status);
    onStatusFilter?.(status);
  };

  const handleDocumentTypeChange = (value: string) => {
    const docType = value as string | "ALL";
    setSelectedDocumentType(docType);
    onDocumentTypeFilter?.(docType);
  };

  const clearFilters = () => {
    setSelectedStatus("ALL");
    setSelectedDocumentType("ALL");
    setSearchTerm("");
    onStatusFilter?.("ALL");
    onDocumentTypeFilter?.("ALL");
    onSearch?.("");
  };

  const hasActiveFilters = selectedStatus !== "ALL" || selectedDocumentType !== "ALL" || searchTerm !== "";

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de búsqueda y botón de filtros */}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          variant={isFiltersVisible ? "default" : "outline"}
          size="default"
          className="h-12 gap-2"
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 px-2 py-0 text-xs">
              {[
                selectedStatus !== "ALL" ? 1 : 0,
                selectedDocumentType !== "ALL" ? 1 : 0,
                searchTerm ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filtros expandibles */}
      {isFiltersVisible && (
        <div className="flex flex-wrap items-center gap-4 p-4 border border-border rounded-lg bg-muted/30">
          {/* Filtro por estado */}
          <div className="flex-1 min-w-[150px]">
            <label className="text-sm font-medium mb-1.5 block">
              Estado de la cita
            </label>
            <Select
              value={selectedStatus}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full h-10 bg-background">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent className="bg-secondary">
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por tipo de documento */}
          <div className="flex-1 min-w-[150px]">
            <label className="text-sm font-medium mb-1.5 block">
              Tipo de documento
            </label>
            <Select
              value={selectedDocumentType}
              onValueChange={handleDocumentTypeChange}
            >
              <SelectTrigger className="w-full h-10 bg-background">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent className="bg-secondary">
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "ALL" ? "Todos" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botón para limpiar filtros */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="mt-6"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
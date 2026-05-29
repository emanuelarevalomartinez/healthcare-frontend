import { MoreHorizontalIcon, InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

export interface TableAction<T> {
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "destructive";
  separatorBefore?: boolean;
}

interface TableWrapperProps<T> {
  cols: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
}

export function TableWrapper<T>({ cols, data, actions }: TableWrapperProps<T>) {
  const totalColumns = actions && actions.length > 0 ? cols.length + 1 : cols.length;
  const isEmpty = !data || data.length === 0;

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[50vh] w-full animate-fade-in">
      <div className="bg-muted rounded-full p-4 mb-4 text-muted-foreground">
        <InboxIcon className="size-12 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        No hay elementos disponibles
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-1">
        Actualmente no existen registros para mostrar en esta tabla.
      </p>
    </div>
  );

  return (
    <div className="w-full">
      {/* Mobile View */}
      <div className="block lg:hidden space-y-4">
        {isEmpty ? (
          <div className="border border-border bg-card text-card-foreground rounded-2xl shadow-sm">
            <EmptyState />
          </div>
        ) : (
          data.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="border border-border bg-card text-card-foreground rounded-2xl p-4 shadow-sm relative"
            >
              {actions && actions.length > 0 && (
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card" align="end">
                      {actions.map((action, actionIndex) => (
                        <div key={actionIndex}>
                          {action.separatorBefore && <DropdownMenuSeparator />}
                          <DropdownMenuItem
                            variant={
                              action.variant === "destructive"
                                ? "destructive"
                                : "default"
                            }
                            onClick={() => action.onClick(row)}
                          >
                            {action.label}
                          </DropdownMenuItem>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              <div className="space-y-2 pr-8">
                {cols.map((col, colIndex) => (
                  <div
                    key={colIndex}
                    className="flex flex-col sm:flex-row sm:justify-between border-b border-border/50 pb-1 last:border-0"
                  >
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider sm:mb-0">
                      {col.header}
                    </span>
                    <span className="text-sm text-foreground font-medium break-all">
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted/50">
              {cols.map((col, index) => (
                <TableHead key={index} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
              {actions && actions.length > 0 && (
                <TableHead className="text-right">Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={totalColumns} className="p-0">
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="border-border hover:bg-muted/30 transition-colors"
                >
                  {cols.map((col, colIndex) => (
                    <TableCell key={colIndex} className={col.className}>
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode)}
                    </TableCell>
                  ))}

                  {actions && actions.length > 0 && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card" align="end">
                          {actions.map((action, actionIndex) => (
                            <div key={actionIndex}>
                              {action.separatorBefore && (
                                <DropdownMenuSeparator />
                              )}
                              <DropdownMenuItem
                                variant={
                                  action.variant === "destructive"
                                    ? "destructive"
                                    : "default"
                                }
                                onClick={() => action.onClick(row)}
                              >
                                {action.label}
                              </DropdownMenuItem>
                            </div>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
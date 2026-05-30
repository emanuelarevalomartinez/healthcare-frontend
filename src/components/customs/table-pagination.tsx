'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useLanguage } from "@/lib";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  page,
  size,
  totalElements,
  totalPages,
  onPageChange,
}: TablePaginationProps) {

  const { dictionary } = useLanguage();
  const t = dictionary.components.pagination;

  const currentPage = page + 1;

  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            className="cursor-pointer"
            onClick={() => onPageChange(0)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            className="cursor-pointer"
            isActive={currentPage === i}
            onClick={() => onPageChange(i - 1)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            className="cursor-pointer"
            onClick={() => onPageChange(totalPages - 1)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  const startElement = page * size + 1;
  const endElement = Math.min(startElement + size - 1, totalElements);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4 px-1">
      <p className="text-sm text-muted-foreground text-center sm:text-left">
        {t.showing}
        <span className="font-medium text-foreground px-1">
          {startElement}
        </span>{" "}
        {t.to}
        <span className="font-medium text-foreground px-1">
          {endElement}
        </span>{" "}
        {t.of}
        <span className="font-medium text-foreground px-1">
          {totalElements}
        </span>
        {t.results}
      </p>

      <Pagination className="w-auto mx-0 justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              aria-label="Go to previous page"
              size="default"
              className={cn(
                "gap-1 pl-2.5 cursor-pointer",
                page === 0 && "pointer-events-none opacity-50"
              )}
              onClick={(e) => {
                e.preventDefault();
                if (page > 0) onPageChange(page - 1);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{t.previous}</span>
            </PaginationLink>
          </PaginationItem>

          {renderPageNumbers()}

          <PaginationItem>
            <PaginationLink
              aria-label="Go to next page"
              size="default"
              className={cn(
                "gap-1 pr-2.5 cursor-pointer",
                page === totalPages - 1 && "pointer-events-none opacity-50"
              )}
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages - 1) onPageChange(page + 1);
              }}
            >
              <span>{t.next}</span>
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { TranslationDictionary } from "@/lib";
import { PaginatedData } from "@/lib/server/api-response";
import {
  deleteConsultationHistoryByDate,
  deleteConsultationHistoryById,
  findConsultationHistoriesGroupedByDate,
} from "../services";
import { ConsultationHistoriesApiResponse } from "../types";

type DeleteTarget =
  | { type: "single"; id: string; label: string }
  | { type: "date"; date: string; label: string };

interface Props {
  dictionary: TranslationDictionary;
}

export function useConsultationHistoryActions({ dictionary }: Props) {
  const t = dictionary.dashboard.consultationHistories;

  const [data, setData] =
    useState<PaginatedData<ConsultationHistoriesApiResponse>>();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageSize = 10;

  const fetchHistories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await findConsultationHistoriesGroupedByDate({
        page: currentPage,
        size: pageSize,
        ascending: false,
      });
      const result = response.data;
      if (result.content.length === 0 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
        return;
      }
      setData(result);
    } catch (error) {
      console.error("Error to load consultation histories: ", error);
      toast.error(t.errorLoad);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, t.errorLoad]);

  const requestDeleteOne = (id: string, label: string) =>
    setDeleteTarget({ type: "single", id, label });

  const requestDeleteByDate = (date: string, label: string) =>
    setDeleteTarget({ type: "date", date, label });

  const closeDeleteDialog = () => setDeleteTarget(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const response =
        deleteTarget.type === "single"
          ? await deleteConsultationHistoryById(deleteTarget.id)
          : await deleteConsultationHistoryByDate(deleteTarget.date);

      if (response.status === 200 || response.status === 204) {
        toast.success(
          deleteTarget.type === "single"
            ? t.successDeleteOne
            : t.successDeleteDay
        );
        await fetchHistories();
      }
    } catch (error) {
      console.error("Error to delete consultation history: ", error);
      toast.error(t.errorDelete);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return {
    data,
    isLoading,
    isDeleting,
    currentPage,
    setCurrentPage,
    fetchHistories,
    deleteTarget,
    requestDeleteOne,
    requestDeleteByDate,
    closeDeleteDialog,
    confirmDelete,
  };
}

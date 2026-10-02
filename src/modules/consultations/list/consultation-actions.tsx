'use client';

import { TranslationDictionary } from "@/lib";
import { getConsultationSelectedDateToViewLocalStorage, setConsultationSelectedDateToViewLocalStorage } from "@/lib/utils/local-storage";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { PaginatedData } from "@/lib/server/api-response";
import { ConsultationApiResponse } from "../types";
import { getAllConsultationsFiltered } from "../services";

interface UseConsultationActionsProps {
  dictionary: TranslationDictionary;
}

export function useConsultationActions({ dictionary }: UseConsultationActionsProps) {
  const router = useRouter();
  const t = dictionary.dashboard.consultations;

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;
   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
   const [consultationsData, setConsultationsDataData] =
       useState<PaginatedData<ConsultationApiResponse>>();

     useEffect(() => {
       const savedData = getConsultationSelectedDateToViewLocalStorage();
   
       if (savedData) {
         setSelectedDate(parse(savedData.consultationSelectedDate, "yyyy-MM-dd", new Date()));
         return;
       }
   
       const currentDate = new Date();
   
       setSelectedDate(currentDate);
   
       setConsultationSelectedDateToViewLocalStorage({
         consultationSelectedDate: format(currentDate, "yyyy-MM-dd"),
       });
     }, []);

     const fetchAppointmentsFiltered = useCallback(
         async (date?: Date) => {
           const dateToUse = date ?? selectedDate;
     
           if (!dateToUse) return;
     
           setIsLoading(true);
     
           try {
             const dateString = format(dateToUse, "yyyy-MM-dd");
     
             const response = await getAllConsultationsFiltered({
               page: currentPage,
               size: pageSize,
               ascending: true,
               date: dateString,
             });
     
             setConsultationsDataData(response.data);
           } catch (error) {
             console.error("Error to load the consultations: ", error);
           } finally {
             setIsLoading(false);
           }
         },
         [currentPage, selectedDate]
       );


     const handleDateChange = useCallback(
        (newDate: Date | undefined) => {
          if (!newDate) return;
    
          setSelectedDate(newDate);
    
          setConsultationSelectedDateToViewLocalStorage({
            consultationSelectedDate: format(newDate, "yyyy-MM-dd"),
          });
    
          fetchAppointmentsFiltered(newDate);
        },
        [fetchAppointmentsFiltered]
      );

      return{
        selectedDate,
        handleDateChange
      }

}
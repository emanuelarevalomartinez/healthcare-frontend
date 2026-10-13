"use client";

import { useEffect, useState } from "react";
import { USER_ROLE } from "@/lib";
import { ConsultationHistoryTimeline } from "./consultation-history-timeline";
import { getUserDataLocalStore } from "@/lib/utils/local-storage";

export function ConsultationHistoryList() {

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(getUserDataLocalStore()?.role === USER_ROLE.ADMIN);
  }, []);

  return <ConsultationHistoryTimeline isAdmin={isAdmin} />;
}
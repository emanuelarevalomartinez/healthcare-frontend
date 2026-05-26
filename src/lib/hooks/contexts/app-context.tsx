"use client";

import { createContext, useContext, useState } from "react";

interface AppContextType {
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        isSheetOpen,
        setIsSheetOpen
    }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
"use client";

import { NavigationMenuSearch } from "@/modules/navigation-menu/items/navigation-menu-search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HEALTHCARE_ICON } from "@/lib";
import { getTokenLocalStore } from "@/lib/utils/local-storage";
import { useEffect, useState } from "react";
import { NavigationUserProfile } from "./items/navigation-user-profile";
import { NavigationUserNotifications } from "./items/navigation-user-notifications";
import { NavigationUserTheme } from "./items/navigation-user-theme";
import { NavigationUserLanguage } from "./items/navigation-user-language";

export function NavigationMenu() {
  const [isAutenticated, setisAutenticated] = useState(false);

  useEffect(() => {
    const token = getTokenLocalStore();
    setisAutenticated(!!token);
  }, []);

  return (
    <>
      <div
        className={`bg-secondary ${
          isAutenticated
            ? "flex w-[80%] ml-[20%] items-end justify-end"
            : "w-full"
        }`}
      >
        <header className="fixed top-0 right-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-6">
            {!isAutenticated && (
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={HEALTHCARE_ICON.src}
                    alt={HEALTHCARE_ICON.alt}
                  />
                  <AvatarFallback> {HEALTHCARE_ICON.alt} </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold tracking-tight leading-none mb-1">
                    HealthCare
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Sistema Clínico Interno
                  </span>
                </div>
              </div>
            )}

            {isAutenticated && <NavigationMenuSearch />}

            <div className="flex items-center gap-3">
              <NavigationUserLanguage />
              <NavigationUserTheme />
              {isAutenticated && <NavigationUserNotifications />}
              {isAutenticated && <NavigationUserProfile />}
            </div>
          </div>
        </header>
      </div>
    </>
  );
}

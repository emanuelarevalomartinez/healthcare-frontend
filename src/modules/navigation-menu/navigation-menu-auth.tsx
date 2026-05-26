'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HEALTHCARE_ICON } from "@/lib";
import { NavigationUserLanguage } from "./items/navigation-user-language";


export function NavigationMenuAuth(){

    return(
        <>
        <header className={`fixed top-0 border-b backdrop-blur border-border w-screen"`}>
          <div className="flex w-screen h-20 items-center justify-between px-6">
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

            <div className="flex items-center gap-3">
              <NavigationUserLanguage />
            </div>
          </div>
        </header>
        </>
    )

}
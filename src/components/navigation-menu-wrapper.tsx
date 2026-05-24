'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HEALTHCARE_ICON } from "@/lib";
import { Bell, Calendar, ChevronDown, Languages, Moon, Search, Users } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getTokenLocalStore } from "@/lib/utils/local-storage";

export function NavigationMenuWrapper() {

  const [isAutenticated, setisAutenticated] = useState(false);
  
    useEffect(() => {
      const token = getTokenLocalStore();
      setisAutenticated(!!token);
    }, []);

  {/*  <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink>
              <Avatar>
                <AvatarImage
                  src={HEALTHCARE_ICON.src}
                  alt={HEALTHCARE_ICON.alt}
                />
                <AvatarFallback> {HEALTHCARE_ICON.alt} </AvatarFallback>
              </Avatar>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink> Holaaaa </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className="NavigationMenuLink"
              href="https://github.com/radix-ui"
            >
              Github
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> */}

  return (
    <div className={`bg-secondary ${ isAutenticated ? "flex w-[80%] ml-[20%] items-end justify-end" : "w-full" }`}>
     

   { isAutenticated == true ? (
     

<header className="sticky top-0 right-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-6">
        
        {/* SECCIÓN IZQUIERDA: LOGO & TITULO */}
        {/* <div className="flex items-center gap-4">
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
        </div> */}

        {/* SECCIÓN CENTRAL: BÚSQUEDA Y STATUS CONTENEDOR */}
        <div className="flex flex-1 items-center justify-center px-10">
          <div className="flex w-full max-w-4xl items-center justify-between gap-6 rounded-2xl bg-card px-5 py-2.5 shadow-sm">
            
            {/* BUSCADOR CON SHADCN INPUT */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar pacientes, citas o médicos..."
                className="w-full pl-9 bg-background border-muted"
              />
            </div>

            {/* ESTADO RÁPIDO */}
            <div className="hidden items-center gap-6 lg:flex text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">Citas Hoy</span>
                  <span className="font-semibold text-foreground">24</span>
                </div>
              </div>

              <div className="h-8 w-px bg-border" />

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">Médicos Activos</span>
                  <span className="font-semibold text-foreground">5</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECCIÓN DERECHA: ACCIONES Y USUARIO */}
        <div className="flex items-center gap-3">
          
          {/* SECTOR DE IDIOMA (NUEVO) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-card gap-1">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              <DropdownMenuLabel>Idioma / Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center justify-between">
                <span>Español</span>
                <span className="text-xs text-muted-foreground">ES</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center justify-between">
                <span>English</span>
                <span className="text-xs text-muted-foreground">EN</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* BOTÓN TEMA */}
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-card">
            <Moon className="h-5 w-5" />
          </Button>

          {/* BOTÓN NOTIFICACIONES */}
          <Button variant="outline" size="icon" className="relative h-11 w-11 rounded-xl bg-card">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
              3
            </span>
          </Button>

          {/* MENÚ DE USUARIO CON DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-auto gap-3 rounded-2xl bg-card px-3 py-2 text-left hover:bg-muted">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 font-semibold text-primary text-xs">
                    CM
                  </AvatarFallback>
                </Avatar>
                
                <div className="hidden flex-col xl:flex">
                  <span className="text-sm font-semibold leading-none mb-1">
                    Dr. Carlos Martínez
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Cardiólogo
                  </span>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-muted-foreground xl:block opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>


   ) 
   
   :
   (
<header className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-6">
        
        {/* SECCIÓN IZQUIERDA: LOGO & TITULO */}
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

        

        {/* SECCIÓN DERECHA: ACCIONES Y USUARIO */}
        <div className="flex items-center gap-3">
          
          {/* SECTOR DE IDIOMA (NUEVO) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-card gap-1">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              <DropdownMenuLabel>Idioma / Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center justify-between">
                <span>Español</span>
                <span className="text-xs text-muted-foreground">ES</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center justify-between">
                <span>English</span>
                <span className="text-xs text-muted-foreground">EN</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* BOTÓN TEMA */}
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-card">
            <Moon className="h-5 w-5" />
          </Button>

        </div>
      </div>
    </header>
   )
   }

    </div>
  );
}

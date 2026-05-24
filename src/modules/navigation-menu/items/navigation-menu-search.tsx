import { Calendar, Search, Users } from "lucide-react";
import { Input } from "../../../components/ui/input";

export function NavigationMenuSearch() {
  return (
    <>
      <div className="flex flex-1 items-center justify-center px-10">
        <div className="flex w-full max-w-4xl items-center justify-between gap-6 rounded-2xl bg-card px-5 py-2.5 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar pacientes, citas o médicos..."
              className="w-full pl-9 bg-background border-muted"
            />
          </div>

          <div className="hidden items-center gap-6 lg:flex text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">
                  Citas Hoy
                </span>
                <span className="font-semibold text-foreground">24</span>
              </div>
            </div>

            <div className="h-8 w-px bg-border" />

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">
                  Médicos Activos
                </span>
                <span className="font-semibold text-foreground">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";

export function NavigationMenuSearch() {
  return (
    <>
      <div className="flex flex-1 items-center justify-center pl-1 pr-3">
        <div className="flex w-full items-center justify-between gap-6 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar pacientes, citas o médicos..."
              className="w-full h-12 pl-9 bg-background border-muted"
            />
          </div>
        </div>
      </div>
    </>
  );
}

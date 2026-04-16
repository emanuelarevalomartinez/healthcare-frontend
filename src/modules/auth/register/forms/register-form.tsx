"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/lib/routes/routes";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export default function RegisterForm() {
  const router = useRouter();

  function handleGoTOLoginView() {
    router.push(routes.auth.login);
  }

  return (
    <>
      <div>
        <Card className="bg-card border border-border rounded-lg w-full max-w-sm md:min-w-lg">
          <CardHeader>
            <CardTitle className="text-foreground text-center">
              Registrate con nosotros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Nombre de usuario</Label>
                  <Input id="email" type="text" placeholder="Bob" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>

                <Field className="w-full">
                  <FieldLabel>Rol</FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary">
                      <SelectGroup>
                        <SelectItem value="apple">ADMINISTRADOR</SelectItem>
                        <SelectItem value="banana">DOCTOR</SelectItem>
                        <SelectItem value="blueberry">RECEPCIONISTA</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                  </div>
                  <Input id="password" type="password" required />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confirmar Contraseña</Label>
                  </div>
                  <Input id="password" type="password" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2 border-border">
            <Button
              onClick={() => {
                handleGoTOLoginView();
              }}
              type="submit"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/60 w-full"
            >
              Autenticarse
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

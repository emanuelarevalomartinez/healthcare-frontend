"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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

export default function LoginForm() {
  const router = useRouter();

  function handleGoTORegisterView() {
    router.push(routes.auth.register);
  }

  return (
    <>
      <div>
        <Card className="bg-card border border-border rounded-lg w-full max-w-sm md:min-w-lg">
          <CardHeader>
            <div className="flex w-full h-20 justify-center">
<Avatar className="w-20 h-20">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
              <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>
            </div>
            <CardTitle className="text-foreground text-center">
              Inicia sesión en tu cuenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                  </div>
                  <Input id="password" type="password" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2 border-border">
            <Button
              onClick={() => {
                handleGoTORegisterView();
              }}
              type="submit"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/60 w-full"
            >
              Registrarse
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

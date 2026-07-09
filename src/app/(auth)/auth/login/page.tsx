import LoginForm from "@/modules/auth/login/forms/login-form";
import { Suspense } from "react";

export default async function Page() {
   return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

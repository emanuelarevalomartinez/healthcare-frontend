"use client";

import { DialogWrapper } from "@/components/customs/dialog-wrapper";
import { useState } from "react";
import { ItemDoctorForm } from "./item-doctor-form";

export function DoctorForm() {
  const [openDetails, setOpenDetails] = useState(true);

  // TODO esto es para no cerrar el modal hasta que se termine con el formulario
  // preventOutsideClose

  return (
    <>
      <DialogWrapper
        open={openDetails}
        onOpenChange={setOpenDetails}
        title="Completa tu perfil profesional"
        description="Antes de continuar, necesitamos algunos datos adicionales para configurar correctamente tu perfil médico."
        className="sm:min-w-xl"
        showCloseButton={false}
        
      >
        <ItemDoctorForm />
      </DialogWrapper>
    </>
  );
}

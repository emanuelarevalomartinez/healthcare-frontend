import { Card } from "@/components/ui/card";
import { AppointmentApiResponse } from "../types";

type Props = {
  appointment: AppointmentApiResponse;
};

export function AppointmentDetails({ appointment }: Props) {
  return (
    <Card className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Motivo de consulta</p>
          <p className="text-sm">{appointment.consultationReason || "No especificado"}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Estado</p>
          <p className="text-sm">{appointment.status}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Duración</p>
          <p className="text-sm">{appointment.durationMinutes} minutos</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Fecha y hora</p>
          <p className="text-sm">
            {new Date(appointment.appointmentDateTime).toLocaleString()}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Paciente</p>
          <p className="text-sm">{appointment.patientFullName || "No disponible"}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Doctor</p>
          <p className="text-sm">{appointment.doctorFullName || "No disponible"}</p>
        </div>
      </div>

      {appointment.notes && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Notas</p>
          <p className="text-sm border rounded-md p-3 bg-muted/50">
            {appointment.notes}
          </p>
        </div>
      )}

      {appointment.cancellationReason && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-destructive">Motivo de cancelación</p>
          <p className="text-sm border border-destructive/20 rounded-md p-3 bg-destructive/10 text-destructive">
            {appointment.cancellationReason}
          </p>
        </div>
      )}
    </Card>
  );
}
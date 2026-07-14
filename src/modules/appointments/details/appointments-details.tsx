import { AppointmentApiResponse } from "../types";


type Props = {
  appointment: AppointmentApiResponse;
};

export function AppointmentDetails({
  appointment,
}: Props) {
  return (
    <div className="space-y-4">

      <div>
        <strong>Motivo:</strong>
        <p>{appointment.consultationReason}</p>
      </div>

      <div>
        <strong>Estado:</strong>
        <p>{appointment.status}</p>
      </div>

      <div>
        <strong>Notas:</strong>
        <p>{appointment.notes}</p>
      </div>

    </div>
  );
}
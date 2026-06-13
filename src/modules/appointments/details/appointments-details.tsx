import { Appointment } from "../list/appointments-list";


type Props = {
  appointment: Appointment;
};

export function AppointmentDetails({
  appointment,
}: Props) {
  return (
    <div className="space-y-4">

      <div>
        <strong>Paciente:</strong>
        <p>{appointment.patient.fullName}</p>
      </div>

      <div>
        <strong>Médico:</strong>
        <p>{appointment.doctor.fullName}</p>
      </div>

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
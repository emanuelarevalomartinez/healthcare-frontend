import {
  AppointmentSelectedDateToViewLocalStorageInterface,
  ConsultationSelectedDateToViewLocalStorageInterface,
  UserDataLocalStorageInterface,
} from "./local-storage-type";

export enum LOCAL_STORAGE {
  USER_DATA = "user_data",
  APPOINTMENT_SELECTED_DATE_TO_VIEW = "appointment_selected_date_to_view",
  CONSULTATION_SELECTED_DATE_TO_VIEW = "consultation_selected_date_to_view",
}

export const getUserDataLocalStore =
  (): UserDataLocalStorageInterface | null => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return null;
    }

    const currentUserDataJson = localStorage.getItem(LOCAL_STORAGE.USER_DATA);

    if (currentUserDataJson) {
      const userData: UserDataLocalStorageInterface =
        JSON.parse(currentUserDataJson);
      return userData;
    } else {
      return null;
    }
  };

export const setUserDataLocalStore = (
  newUserData: UserDataLocalStorageInterface
) => {
  const userDataJson = JSON.stringify(newUserData);
  localStorage.setItem(LOCAL_STORAGE.USER_DATA, userDataJson);
};

export const deleteUserDataLocalStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE.USER_DATA);
};

export const getAppointmentSelectedDateToViewLocalStorage =
  (): AppointmentSelectedDateToViewLocalStorageInterface | null => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return null;
    }

    const currentAppointmentSelectedDataToViewJson = localStorage.getItem(
      LOCAL_STORAGE.APPOINTMENT_SELECTED_DATE_TO_VIEW
    );

    if (currentAppointmentSelectedDataToViewJson) {
      const appointmentSelectedDataToView: AppointmentSelectedDateToViewLocalStorageInterface =
        JSON.parse(currentAppointmentSelectedDataToViewJson);
      return appointmentSelectedDataToView;
    } else {
      return null;
    }
  };

export const setAppointmentSelectedDateToViewLocalStorage = (
  newAppointmentSelectedDataToView: AppointmentSelectedDateToViewLocalStorageInterface
) => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }

  const currentAppointmentSelectedDataToViewJson = JSON.stringify(
    newAppointmentSelectedDataToView
  );

  localStorage.setItem(
    LOCAL_STORAGE.APPOINTMENT_SELECTED_DATE_TO_VIEW,
    currentAppointmentSelectedDataToViewJson
  );
};

export const deleteAppointmentSelectedDateToViewLocalStorage = () => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }

  localStorage.removeItem(LOCAL_STORAGE.APPOINTMENT_SELECTED_DATE_TO_VIEW);
};

export const getConsultationSelectedDateToViewLocalStorage =
  (): ConsultationSelectedDateToViewLocalStorageInterface | null => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return null;
    }

    const currentConsultationSelectedDataToViewJson = localStorage.getItem(
      LOCAL_STORAGE.CONSULTATION_SELECTED_DATE_TO_VIEW
    );

    if (currentConsultationSelectedDataToViewJson) {
      const consultationSelectedDataToView: ConsultationSelectedDateToViewLocalStorageInterface =
        JSON.parse(currentConsultationSelectedDataToViewJson);
      return consultationSelectedDataToView;
    } else {
      return null;
    }
  };

export const setConsultationSelectedDateToViewLocalStorage = (
  newConsultationSelectedDataToView: ConsultationSelectedDateToViewLocalStorageInterface
) => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }

  const currentConsultationSelectedDataToViewJson = JSON.stringify(
    newConsultationSelectedDataToView
  );

  localStorage.setItem(
    LOCAL_STORAGE.CONSULTATION_SELECTED_DATE_TO_VIEW,
    currentConsultationSelectedDataToViewJson
  );
};

export const deleteConsultationSelectedDateToViewLocalStorage = () => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }

  localStorage.removeItem(LOCAL_STORAGE.CONSULTATION_SELECTED_DATE_TO_VIEW);
};

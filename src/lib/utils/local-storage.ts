import {
  UserAuthCredentialsInterface,
  UserDataLocalStorageInterface,
} from "./local-storage-type";

export enum LOCAL_STORAGE {
  USER_AUTH_CREDENTIALS = "user_auth_credentials",
  USER_DATA = "user_data",
}

export const getUserAuthCredentialsLocalStore =
  (): UserAuthCredentialsInterface | null => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return null;
    }

    const currentUserAuthCredentialsJson = localStorage.getItem(
      LOCAL_STORAGE.USER_AUTH_CREDENTIALS
    );

    if (currentUserAuthCredentialsJson) {
      const userAuthCredentials: UserAuthCredentialsInterface = JSON.parse(
        currentUserAuthCredentialsJson
      );
      return userAuthCredentials;
    } else {
      return null;
    }
  };

export const setUserAuthCredentialsLocalStore = (
  newUserAuthCredentials: UserAuthCredentialsInterface
) => {
  const userAuthCredentialsJson = JSON.stringify(newUserAuthCredentials);
  localStorage.setItem(
    LOCAL_STORAGE.USER_AUTH_CREDENTIALS,
    userAuthCredentialsJson
  );
};

export const deleteUserAuthCredentialsLocalStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE.USER_AUTH_CREDENTIALS);
};

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

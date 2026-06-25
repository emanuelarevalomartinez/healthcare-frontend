import { USER_ROLE } from "../constants";

export interface UserDataLocalStorageInterface {
  id: string;
  email: string;
  role: USER_ROLE;
  username: string;
  doctorProfileCompleted: boolean;
}

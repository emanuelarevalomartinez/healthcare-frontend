import { USER_ROLE } from "../constants";

export interface UserDataLocalStorageInterface {
  email: string;
  role: USER_ROLE;
  username: string;
}

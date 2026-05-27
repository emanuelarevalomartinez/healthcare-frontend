

export enum COOKIE_KEYS {
  ACCESS_TOKEN = "accessToken",
  REFRESH_TOKEN = "refreshToken",
}

export interface UserAuthCredentialsInterface {
  accessToken: string;
  refreshToken: string;
}
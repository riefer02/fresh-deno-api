export interface LoginCredentials {
  [key: string]: string | FormDataEntryValue;
  email: string;
  password: string;
}

export interface JWTUserCredentials {
  sub: string;
  email: string;
  exp: number;
  iss: string;
}

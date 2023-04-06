export interface LoginPayload {
  emailId: string;
  password: string;
}

export interface RegisteredPayload {
  id: string;
  fullName: string;
  email: string;
  password: string;
  gender: string;
  dateOfBirth: string;
  mobile: Number;
}

export interface updateDetailsPayload {
  id: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword:string;
  gender: string;
  dateOfBirth: string;
  mobile: Number;
}

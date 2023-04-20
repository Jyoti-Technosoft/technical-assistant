export const LOGIN_SUCCESSFULLY: toastMessage = {
  label: 'Login Successfully',
  icon: 'bi bi-check-lg',
};
export const LOGOUT_SUCCESSFULLY: toastMessage = {
  label: 'Logout Successfully',
  icon: 'bi bi-check-lg',
};
export const LOGIN_WRONG_CREDENTIAL =
  'No User Found With This Login credentical';

export const REGISTERED_SUCCESSFULLY: toastMessage = {
  label: 'Registerd Successfully',
  icon: 'bi bi-check-lg',
};
export const ALREADY_REGISTERED_EMAIL =
  'User with this email already registered';

export const USER_DETAILS_UPDATE_SUCCESSFULLY: toastMessage = {
  label: 'User Details Update Successfully',
  icon: 'fa-solid fa-check',
};
export const NO_QUIZ = {
  label: 'No Quiz Found',
  icon: 'fa-regular fa-triangle-exclamation',
};
export const RESULT_QUIZ = {
  label: 'No Recent Quiz Played Yet',
  icon: 'bi bi-exclamation-circle',
};
export const TOKEN = 'No Token Found';

export interface toastMessage {
  label: string;
  icon: string;
}

export enum TOAST_BG_COLOR {
  TOAST_SUCCESS_COLOR = 'bg-success text-light',
  TOAST_ERROR_COLOR = 'bg-danger text-light',
}

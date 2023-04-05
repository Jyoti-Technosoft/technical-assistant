export const LOGIN_SUCCESSFULLY: toastMessage = {
  label: 'Login Successfully',
  icon: 'fa-solid fa-check',
  className: 'bg-success text-light',
};
export const LOGOUT_SUCCESSFULLY: toastMessage = {
  label: 'Logout Successfully',
  icon: 'fa-solid fa-check',
  className: 'bg-success text-light',
};
export const LOGIN_WRONG_CREDENTIAL =
  'No User Found With This Login credentical';

export const REGISTERED_SUCCESSFULLY: toastMessage = {
  label: 'Registerd Successfully',
  icon: 'fa-solid fa-check',
  className: 'bg-success text-light',
};
export const ALREADY_REGISTERED_EMAIL =
  'User with this email already registered';

export const NO_QUIZ = {
  label: 'No Quiz Found',
  icon: 'fa-solid fa-triangle-exclamation',
  className: 'bg-danger text-light',
};
export const RESULT_QUIZ = {
  label: 'No Quiz Played Yet',
  icon: 'fa-solid fa-triangle-exclamation',
  className: 'bg-danger text-light',
};
export const TOKEN = 'No Token Found';

export interface toastMessage {
  label: string;
  icon: string;
  className?: string;
}

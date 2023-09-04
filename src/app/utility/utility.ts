export enum LOCALSTORAGE_KEY {
    TOKEN = 'token',
    USERDATA = 'userData',
    QUIZ_DETAILS = 'quizDetails',
    LAST_RESULT_DATA = 'lastResultData',
    REGISTER_USER = 'registerUser',
    RESULT = 'result'
}

export enum PATTERN {
    EMAIL_PATTERN = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$",
    PASSWORD_PATTERN = "^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$",
    FULL_NAME_PATTERN = "^[a-zA-Z ]*$",
    MOBILE_PATTERN = "^[1-9]{1}[0-9]{9}$"
}

export enum MESSAGE {
    LOGIN_SUCCESS = 'Login Successfully',
    LOGIN_FAILED = 'Login Error',
    REGISTRATION_SUCCESS = 'Registration Successfully',
    REGISTRATION_FAILED = 'Registation Error',
    ALL_RESULT_FAILED = 'Error! While fetching result data',
    COUNT_FAILED = 'Error! While fetching quiz count data',
    QUIZ_DETAIL_FAILED = 'Error! While fetching quiz details',
    QUESTION_FAILED = 'Sorry! No questions are available',
    TIMER_OFF = 'Sorry! Your time is over',
    NO_ANS_SELECTION = 'Your answer is already selected',
    SOMTHING = 'Sorry! Something went wrong',
    NO_QUIZ = 'No Recent Quiz Played Yet',
    PASSWORD_CHANGE_SUCCESSFUL = 'Your password has been change successfully',
    PROFILE_UPDATE_SUCCESSFUL = 'Your profile has been updated successfully'
};
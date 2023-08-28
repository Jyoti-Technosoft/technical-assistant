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
    PASSWORD_PATTERN = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,15}$",
    FULL_NAME_PATTERN = "^[a-zA-Z ]*$",
    MOBILE_PATTERN = "^[1-9]{1}[0-9]{9}$"
}
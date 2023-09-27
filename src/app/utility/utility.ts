export enum LOCALSTORAGE_KEY {
    TOKEN = 'token',
    USERID = 'userId',
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
    QUESTION_FAILED = 'Sorry! No questions are available',
    TIMER_OFF = 'Sorry! Your time is over',
    NO_ANS_SELECTION = 'Your answer is already selected',
    MISSED_OUT = `Opps! You can not able to select any answer`,
    NO_QUIZ = 'No Recent Quiz Played Yet',
    EXIT_FROM_QUIZ = 'You are successfully exit from quiz'
};
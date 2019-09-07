'use strict';

module.exports = {
    VALIDATION_ERROR_CODE: 400,
    VALIDATION_ERROR_MESSAGE: "Validation fail",

    SERVER_ERROR_CODE: 500,
    SERVER_ERROR_MESSAGE: "Some error occured on server.",

    PLAYER_NOT_FOUND_CODE: 403,
    PLAYER_NOT_FOUND_MESSAGE: 'No player found with this number',

    RESOURCE_NOT_FOUND_CODE: 404,
    RESOURCE_NOT_FOUND_MESSAGE: 'The resource you are looking for does not found.',

    SUCCESS_CODE: 0,
    SUCCESS_MESSAGE: "Success",

    WINNER_CODE: 1,
    WINNER_MESSAGE: "Winner",

    DRAW_CODE: 2,
    DRAW_MESSAGE: "Draw",

    NO_WINNER_YET_CODE: 3,
    NO_WINNER_YET_MESSAGE: "No winner found yet",

    NO_PLAYER_FOUND_AS_PER_TEAM_CODE: 4,
    NO_PLAYER_FOUND_AS_PER_TEAM_MESSAGE: "No player found as per team",

    ALL_QUESTION_DONE_CODE: 5,
    ALL_QUESTION_DONE_MESSAGE: "All questions done",

    NO_QUESTION_AVAILABLE_FOR_QUIZ_CODE: 6,
    NO_QUESTION_AVAILABLE_FOR_QUIZ_MESSAGE: "No question available for quiz",

    NO_MORE_UNIQUE_QUESTION_CODE: 7,
    NO_MORE_UNIQUE_QUESTION_MESSAGE: "No more unique question",

    INVALID_QUESTION_CODE: 8,
    INVALID_QUESTION_MESSAGE: "Invalid question",

    INVALID_TEAM_CODE: 9,
    INVALID_TEAM_MESSAGE: "Invalid team",

    PLAYER_ALREADY_SUBMITTED_THIS_QUESTION_ANSWER_CODE: 10,
    PLAYER_ALREADY_SUBMITTED_THIS_QUESTION_ANSWER_MESSAGE: "Player already submitted this question's answer",

    INVALID_PLAYER_CODE: 11,
    INVALID_PLAYER_MESSAGE: "Invalid player",

    INVALID_QUIZ_CODE: 12,
    INVALID_QUIZ_MESSAGE: "Invalid quiz",

    NO_OTHER_PLAYER_EXIST_FOR_REQUESTED_QUIZ_CODE: 13,
    NO_OTHER_PLAYER_EXIST_FOR_REQUESTED_QUIZ_MESSAGE: "No other player exist for requested quiz",

    NO_MINIMUM_PLAYER_CODE: 14,
    NO_MINIMUM_PLAYER_MESSAGE: "No minimum players",

    QUIZ_NOT_ACTIVE_CODE: 15,
    QUIZ_NOT_ACTIVE_MESSAGE: "Quiz not active",

    PLAYER_QUESTIONS_NOT_UPDATED_CODE: 16,
    PLAYER_QUESTIONS_NOT_UPDATED_MESSAGE: "Players questions are not updated",

    PLAYERS_NOT_UPDATED_TO_BUSY_CODE: 17,
    PLAYERS_NOT_UPDATED_TO_BUSY_MESSAGE: "All players are not updated to busy",

    PROVIDER_NOT_FOUND_CODE: 18,
    PROVIDER_NOT_FOUND_MESSAGE: "No provider found this time",

    TXN_NOT_FOUND_CODE:104,
    TXN_NOT_FOUND_MESSAGE:"Transaction not found with this reference number",

    INVALID_PROVIDER_CODE:101,
    INVALID_PROVIDER_MESSAGE:"Invalid provider code received for this transaction",

    INIT_TXN_ERROR: 102,
    INIT_TXN_ERROR_MSG:"Some Error occured while transacion initiated please check status after some time.",

    

}
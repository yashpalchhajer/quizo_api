"use strict";

const PREFIX = 'qa_';

const TABLE_USER_MASTER = 'users';
const USER_REQUEST_CHATS = 'user_request_chats';
const USER_MESSAGE_THREAD = 'user_message_thread';
const USER_CHAT_MESSAGE = 'user_chat_message';

const TABLE_MERCHANT_MASTER = PREFIX+'merchant_masters';
const TABLE_PLAYERS = PREFIX+'players';
const TABLE_OTP_TOKENS = PREFIX+'otp_tokens';
const TABLE_QUIZ_CATEGORY = PREFIX+'quiz_categories';
const TABLE_QUIZ_CONFIG = PREFIX+'quiz_configs';
const TABLE_PLAYER_AVAILABLE = PREFIX+'players_availables';
const TABLE_QUIZ_TEAM = PREFIX+'quiz_teams';
const TABLE_QUESTION_MASTER = PREFIX+'question_masters';
const TABLE_PLAYER_QUESTIOS = PREFIX+'player_questions';

const TABLE_API_PROVIDERS = PREFIX+'api_providers';
const TABLE_PAYMENT_MASTERS = PREFIX+'payment_masters';
const TABLE_WALLET_MASTERS = PREFIX+'wallet_masters';
const TABLE_WALLETS = PREFIX+'wallets';

module.exports = {
    TABLE_MERCHANT_MASTER,
    TABLE_PLAYERS,
    TABLE_OTP_TOKENS,
    TABLE_QUIZ_CATEGORY,
    TABLE_QUIZ_CONFIG,
    TABLE_PLAYER_AVAILABLE,
    TABLE_QUIZ_TEAM,
    TABLE_QUESTION_MASTER,
    TABLE_PLAYER_QUESTIOS,
    TABLE_API_PROVIDERS,
    TABLE_PAYMENT_MASTERS,
    TABLE_WALLET_MASTERS,
    TABLE_WALLETS,

    TABLE_USER_MASTER,
    USER_REQUEST_CHATS,
    USER_MESSAGE_THREAD,
    USER_CHAT_MESSAGE
}
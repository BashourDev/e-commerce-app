import i18next from "../../i18n";

export const INVALID_EMAIL_MESSAGE = "Email is not valid";
export const INVALID_EMAIL_MESSAGE_ARABIC = "البريد الإلكتروني غير صالح";
export const INVALID_PASSWORD_MESSAGE =
  "Password is too short (minimum is 5 characters)";
export const INVALID_PASSWORD_MESSAGE_ARABIC =
  "كلمة المرور قصيرة جدًا (الحد الأدنى 5 أحرف)";
export const INVALID_CARD_NUMBER_MESSAGE = "Card number is not valid";
export const INVALID_CARD_NUMBER_MESSAGE_ARABIC = "رقم البطاقة غير صالح";
export const INVALID_EXPIRATION_DATE_MESSAGE = "Expiration date is not valid";
export const INVALID_EXPIRATION_DATE_MESSAGE_ARABIC =
  "تاريخ انتهاء الصلاحية غير صالح";

export function validateEmail(email) {
  let emailRegex = /^\w+([\.-]?\w+)*@[a-z A-Z . 0-9]+([\.-]?\w+)$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password.length >= 5;
}

export default {
  validateEmail,
  validatePassword,
};

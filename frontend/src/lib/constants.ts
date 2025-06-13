export const BACKEND_URL = "http://localhost:8080";
export const WS_BACKEND_URL = "ws://localhost:8080";

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const SPECIAL_CHARS_REGEX = /[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?~]/g;

export const PASSWORD_CRITERIA = {
  length: 13,
  uppercase: 2,
  special: 2,
  number: 3,
};

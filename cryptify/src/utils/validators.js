// src/utils/validators.js

export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const hasUppercase  = (v) => /[A-Z]/.test(v);
export const hasDigit      = (v) => /[0-9]/.test(v);
export const hasSpecial    = (v) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(v);
export const isStrongPw    = (v) =>
  v.length >= 8 && hasUppercase(v) && hasDigit(v) && hasSpecial(v);

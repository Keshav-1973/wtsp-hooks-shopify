import { parsePhoneNumberFromString } from "libphonenumber-js";

export function parseIndianPhoneNumber(rawPhone: string) {
  const phoneNumber = parsePhoneNumberFromString(rawPhone, "IN");
  return phoneNumber?.number ?? null;
}

export function isValidIndianPhoneNumber(rawPhone: string): boolean {
  const phoneNumber = parsePhoneNumberFromString(rawPhone, "IN");
  return phoneNumber?.isValid() ?? false;
}

import { Validator } from "@/composables/validation";

/**
 * Simple RFC 5322-lite email regex
 * (Deliberately not extreme)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * # Email Validator
 */
export function email(
    message = "Invalid email address",
): Validator<string> {
    return (value) => {
        if (value === null || value === undefined || value === "") {
            return true; // Let requiredValidator handle empties
        }

        if (!EMAIL_REGEX.test(value)) {
            return message;
        }

        return true;
    };
}

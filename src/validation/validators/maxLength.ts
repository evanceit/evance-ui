import { Validator } from "@/composables/validation";

/**
 * # Max Length Validator
 */
export function maxLength(
    max: number,
    message?: string,
): Validator<string | unknown[]> {
    return (value) => {
        if (value === null || value === undefined) {
            return true;
        }

        const length =
            typeof value === "string" || Array.isArray(value)
                ? value.length
                : undefined;

        if (length === undefined) {
            return true;
        }

        if (length > max) {
            return message ?? `Must be no more than ${max} characters`;
        }

        return true;
    };
}
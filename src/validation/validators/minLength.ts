import { Validator } from "@/composables/validation";

/**
 * # Min Length Validator
 */
export function minLength(
    min: number,
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

        if (length < min) {
            return message ?? `Must be at least ${min} characters`;
        }

        return true;
    };
}
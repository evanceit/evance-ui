import { Validator } from "@/composables/validation";

/**
 * # Pattern Validator
 */
export function pattern(
    pattern: RegExp,
    message = "Invalid format",
): Validator<string> {
    return (value) => {
        if (value === null || value === undefined || value === "") {
            return true;
        }

        if (typeof value !== "string") {
            return true;
        }

        if (!pattern.test(value)) {
            return message;
        }

        return true;
    };
}
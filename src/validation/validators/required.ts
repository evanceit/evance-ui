import { Validator } from "@/composables/validation";

/**
 * # Required Validator
 */
export function required(message = "Required"): Validator {
    return (value) => {
        if (value === null || value === undefined || value === "") {
            return message;
        }
        // Optional: treat empty arrays as invalid
        if (Array.isArray(value) && value.length === 0) {
            return message;
        }
        return true;
    };
}

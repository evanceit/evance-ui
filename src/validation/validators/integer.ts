import { Validator } from "@/composables/validation";

export function integer(
    message = "Must be an integer",
): Validator<number | string> {
    return (value) => {
        if (value === null || value === undefined || value === "") {
            return true;
        }

        const num = Number(value);

        if (!Number.isInteger(num)) {
            return message;
        }

        return true;
    };
}

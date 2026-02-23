import { Validator } from "@/composables/validation";

export function decimal(
    message = "Must be a number",
): Validator<number | string> {
    return (value) => {
        if (value === null || value === undefined || value === "") {
            return true;
        }

        const num = Number(value);

        if (Number.isNaN(num)) {
            return message;
        }

        return true;
    };
}

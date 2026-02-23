import { Validator } from "@/composables/validation";

export function max(max: number, message?: string): Validator<number | string> {
    return (value) => {
        if (value === null || value === undefined || value === "") {
            return true;
        }

        const num = Number(value);

        if (Number.isNaN(num)) {
            return true;
        }

        if (num > max) {
            return message ?? `Must be no more than ${max}`;
        }

        return true;
    };
}

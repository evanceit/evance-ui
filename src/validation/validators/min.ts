import { Validator } from "@/composables/validation";

export function min(min: number, message?: string): Validator<number | string> {
    return (value) => {
        if (value === null || value === undefined || value === "") {
            return true;
        }

        const num = Number(value);

        if (Number.isNaN(num)) {
            return true;
        }

        if (num < min) {
            return message ?? `Must be at least ${min}`;
        }

        return true;
    };
}

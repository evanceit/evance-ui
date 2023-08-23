import {test} from "@jest/globals";
import {FormField} from "@/modules/Form/FormField.ts";

test('Field', () => {
    const field = new FormField('my-field');

    const requiredValidator = () => {
        return (value) => {
            if (value.length) {
                return true;
            }
            return 'Field is required';
        };
    };

    const lengthValidator = (length: number) => {
        return (value) => {
            if (value.length >= length) {
                return true;
            }
            return `Must be a minimum of ${length} characters`;
        };
    };

    field.addValidator(
        requiredValidator(),
        lengthValidator(8)
    );

    field.validate('Hello');

    console.log(field);
});
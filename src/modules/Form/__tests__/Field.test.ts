import {test} from "@jest/globals";
import {Field} from "@/modules/Form/Field.ts";

test('Field', () => {
    const field = new Field('my-field');

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
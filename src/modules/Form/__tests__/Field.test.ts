import {test} from "@jest/globals";
import {FormField} from "@/modules/Form/FormField.ts";
import {ref} from "vue";

test('Field', () => {

    const fieldValue = ref('Hello');

    const field = new FormField('my-field', fieldValue);

    const requiredValidator = () => {
        return (value: any) => {
            if (value.length) {
                return true;
            }
            return 'Field is required';
        };
    };

    const lengthValidator = (length: number) => {
        return (value: any) => {
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

    field.validate();

    field.value = 'Goodbye';

    console.log(fieldValue.value);
});
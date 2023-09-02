import {expect, test} from "@jest/globals";
import {Form} from "@/modules/Form/Form.ts";
import {shallowRef} from "vue";

/**
 * # Test Form.createField()
 *
 * We're also testing Form.removeField()
 */
test('Form.createField()', () => {

    const form = new Form();
    const email = shallowRef(null);
    const emailField = form.createField('email', email);

    emailField.value = 'Hello';

    expect(form.fields.value.length).toBe(1);
    expect(email.value).toBe('Hello');

    form.removeField('email');
    expect(form.fields.value.length).toBe(0);
});


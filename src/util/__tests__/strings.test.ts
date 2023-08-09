import {expect, test} from "@jest/globals";
import {createStringTemplate} from "@/util";

test('createStringTemplate()', () => {

    // Create a basic greeting template
    const template = createStringTemplate("Hello { name }");

    const output = template({
        name: 'Geoff',
        day: 'Wednesday'
    });

    expect(output).toBe('Hello Geoff');
});
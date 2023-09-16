import type {Meta, StoryObj} from "@storybook/vue3";

import { EvRadio } from "../EvRadio";

const meta: Meta<typeof EvRadio> = {
    component: EvRadio,
    title: "Forms/EvRadio",
    argTypes: {

        // Form Field Attributes
        disabled: {
            control: 'boolean',
            description: 'Removes the ability to click or target the input.'
        },
        error: {
            control: 'boolean',
            description: 'Puts the input in a manual error state.'
        },
        id: {
            control: 'text',
            description: 'The ID associated with the form field and the component wrapper'
        },
        modelValue: {
            control: 'string',
            description: "The `model-value` is the `v-model` value of the component."
        },
        name: {
            control: 'text',
            description: "Sets the name attribute of the internal input."
        },
        readonly: {
            control: 'boolean'
        },
        'validate-on': {
            type: 'select',
            description: 'Change what type of event triggers validation to run.',
            options: ['lazy', 'blur', 'input', 'submit', 'blur lazy', 'input lazy', 'submit lazy']
        },
        validators: {
            description: 'An array of validator functions, which evaluate an input value ' +
                'as an argument and must return either true or a string containing an error message. ' +
                'The input field will enter an error state if a function returns'
        },
        // End

        clearable: {
            control: 'boolean',
            description: "When set to `true` the component may be unchecked if currently checked. " +
                "This then sets the `modelValue` to `null`."
        },
        value: {
            control: 'string',
            description: "The value of the input is assigned to `modelValue` when checked."
        }
    },
    args: {
        // Form Field Args
        disabled: false,
        error: false,
        id: undefined,
        modelValue: false,
        name: undefined,
        readonly: false,
        'validate-on': 'input',
        validators: undefined,
        // End

        value: 'Y',
        clearable: false,
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvRadio>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvRadio },
        setup() {
            return { args };
        },
        template: '<ev-radio v-bind="args" />'
    })
};
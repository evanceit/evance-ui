import type {Meta, StoryObj} from "@storybook/vue3";

import { EvRadioGroup } from "../EvRadioGroup";
import {EvRadio} from "@/components";

const meta: Meta<typeof EvRadioGroup> = {
    component: EvRadioGroup,
    title: "Forms/EvRadioGroup",
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
            control: 'select',
            description: "The `model-value` is the `v-model` value of the component.",
            options: ['', 'Y', 'N']
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

        label: {
            control: 'text',
            description: 'Optional label - may be supplied as a prop or within a slot.'
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

        label: 'Example radio group'
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvRadioGroup>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvRadioGroup, EvRadio },
        setup() {
            const requiredValidator = (value) => {
                if (value === 'Y') {
                    return true;
                }
                if (value === 'N') {
                    return 'Not no, yes';
                }
                return 'Select something';
            };

            return { args, requiredValidator };
        },
        data() {
            return {
                radio: 'N',
            }
        },
        template: `<ev-radio-group v-bind="args" :validators="[requiredValidator]">
          <ev-radio value="Y" label="Yes" :clearable="true" />
          <ev-radio value="N" label="No" :clearable="true" />
        </ev-radio-group>`
    })
};
import type {Meta, StoryObj} from "@storybook/vue3";

import { EvTextarea } from "../EvTextarea";
import {InputAppearance} from "@/util";

const meta: Meta<typeof EvTextarea> = {
    component: EvTextarea,
    title: 'Forms/EvTextarea',
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
            control: 'text',
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

        appearance: {
            control: 'select',
            options: Object.values(InputAppearance)
        },
        autofocus: {
            control: 'boolean'
        },
        autogrow: {
            control: 'boolean'
        },
        clearable: {
            control: 'boolean'
        },
        loading: {
            control: 'boolean',
            description: "When `loading` is `true` a linear progress bar is added to the bottom of the textfield " +
                "in an indeterminate state. However, if an `icon` has been set, a circular progress progress bar " +
                "is used instead."
        }
    },
    args: {
        // Form Field Args
        disabled: false,
        error: false,
        id: undefined,
        modelValue: "A\nB\nC\nD\nE\nF\nG\nH",
        name: undefined,
        readonly: false,
        'validate-on': 'input',
        validators: undefined,
        // End

        appearance: InputAppearance.default,
        autofocus: false,
        autogrow: true,
        clearable: false,
        loading: false
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvTextarea>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvTextarea },
        setup() {
            return { args };
        },
        template: '<ev-textarea v-bind="args" />'
    })
};
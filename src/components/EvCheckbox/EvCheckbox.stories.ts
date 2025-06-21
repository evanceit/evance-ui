import type { Meta, StoryObj } from "@storybook/vue3";

import { EvCheckbox } from "../EvCheckbox";

const meta: Meta<typeof EvCheckbox> = {
    component: EvCheckbox,
    title: "Components/Forms/EvCheckbox",
    argTypes: {
        // Form Field Attributes
        disabled: {
            control: "boolean",
            description: "Removes the ability to click or target the input.",
        },
        error: {
            control: "boolean",
            description: "Puts the input in a manual error state.",
        },
        id: {
            control: "text",
            description:
                "The ID associated with the form field and the component wrapper",
        },
        modelValue: {
            control: "boolean",
            description:
                "The `model-value` is the `v-model` value of the component.",
        },
        indeterminate: {
            control: "boolean",
            description: "Sets an indeterminate state for the checkbox.",
        },
        name: {
            control: "text",
            description: "Sets the name attribute of the internal input.",
        },
        readonly: {
            control: "boolean",
        },
        validateOn: {
            control: "select",
            description:
                "Change what type of event triggers validation to run.",
            options: [
                "lazy",
                "blur",
                "input",
                "submit",
                "blur lazy",
                "input lazy",
                "submit lazy",
            ],
        },
        validators: {
            description:
                "An array of validator functions, which evaluate an input value " +
                "as an argument and must return either true or a string containing an error message. " +
                "The input field will enter an error state if a function returns",
        },
        // End

        label: {
            control: "text",
            description:
                "Optional label - may be supplied as a prop or within a slot.",
        },
        hint: {
            control: "text",
            description: "Optional hint usually accompanies the label.",
        },
        focused: {
            control: "boolean",
        },
        trueValue: {
            control: "text",
            description: "Sets the value when checked",
        },
        falseValue: {
            control: "text",
            description: "Sets the value when unchecked",
        },
        value: {
            control: "text",
            description:
                "The value of the input is assigned to `modelValue` when checked.",
        },
        valueComparator: {
            description:
                "A function used to compare the value to determine if the EvCheckbox is checked. " +
                "The function should accept two arguments and return a boolean.",
        },
    },
    args: {
        // Form Field Args
        disabled: false,
        error: false,
        id: undefined,
        modelValue: false,
        name: undefined,
        readonly: false,
        validateOn: "input",
        validators: undefined,
        // End

        label: "Example checkbox",
        focused: false,
        trueValue: undefined,
        falseValue: undefined,
        value: undefined,
        valueComparator: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvCheckbox>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvCheckbox },
        setup() {
            const requiredValidator = (value: any) => {
                return value ? true : "Required";
            };

            return { args, requiredValidator };
        },
        template:
            '<ev-checkbox v-bind="args" :validators="[requiredValidator]" />',
    }),
};

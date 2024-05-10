import type { Meta, StoryObj } from "@storybook/vue3";

import { EvTextfield } from "../EvTextfield";
import { Search } from "../../icons";
import { InputAppearance, InputSize } from "@/util";

const meta: Meta<typeof EvTextfield> = {
    component: EvTextfield,
    title: "Forms/EvTextfield",
    argTypes: {
        // Form Field Attributes
        align: {
            control: "select",
            options: ["left", "center", "right"],
            description: "The text alignment of the input field",
        },
        disabled: {
            control: "boolean",
            description: "Removes the ability to click or target the input.",
        },
        error: {
            control: "boolean",
            description: "Puts the input in a manual error state.",
        },
        focused: {
            control: "boolean",
        },
        id: {
            control: "text",
            description:
                "The ID associated with the form field and the component wrapper",
        },
        modelValue: {
            control: "text",
            description:
                "The `model-value` is the `v-model` value of the component.",
        },
        monospace: {
            control: "boolean",
            description: "Use a monospaced font family for the input field.",
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

        appearance: {
            control: "select",
            options: Object.values(InputAppearance),
        },
        autofocus: {
            control: "boolean",
        },
        autoselect: {
            control: "boolean",
            description:
                "When `autoselect` is `true` any text within the input is selected on focus.",
        },
        clearable: {
            control: "boolean",
        },
        iconStart: {
            control: "select",
            options: ["none", "Search"],
            mapping: {
                none: null,
                Search: Search,
            },
            description: "Appears before input prefix. ",
        },
        iconEnd: {
            control: "select",
            options: ["none", "Search"],
            mapping: {
                none: null,
                Search: Search,
            },
            description: "Appears after input suffix. ",
        },
        label: {
            control: "text",
            description:
                "Optional label - may be supplied as a prop or within a slot.",
        },
        loading: {
            control: "boolean",
            description:
                "When `loading` is `true` a linear progress bar is added to the bottom of the textfield " +
                "in an indeterminate state. However, if an `icon` has been set, a circular progress progress bar " +
                "is used instead.",
        },
        placeholder: {
            control: "text",
        },
        prefix: {
            control: "text",
            description:
                "Appears before the input field but after the `icon`. " +
                "May be used as a prop for a simple text-based prefix, or as a slot for a more complex prefix. " +
                "In this demo we use a prop.",
        },
        rounded: {
            control: "boolean",
        },
        size: {
            control: "select",
            options: Object.values(InputSize),
        },
        suffix: {
            control: "text",
            description:
                "Appears after the input field. " +
                "May be used as a prop when a text suffix is required, or as a slot for a more complex suffix. " +
                "In this demo we use a prop.",
        },
        type: {
            control: "select",
            options: ["text", "number", "search"],
        },
    },
    args: {
        // Form Field Args
        align: undefined,
        disabled: false,
        focused: false,
        error: false,
        id: undefined,
        modelValue: "",
        monospace: undefined,
        name: undefined,
        readonly: false,
        validateOn: "input",
        validators: undefined,
        // End

        appearance: InputAppearance.default,
        autofocus: false,
        autoselect: false,
        clearable: false,
        iconStart: "none",
        iconEnd: "none",
        label: undefined,
        loading: false,
        placeholder: "",
        prefix: "",
        rounded: false,
        size: InputSize.default,
        suffix: "",
        type: "text",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvTextfield>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvTextfield },
        setup() {
            const requiredValidator = (value?: string) => {
                if (!value) {
                    return "Required";
                }
                return true;
            };

            const helloValidator = (value?: string) => {
                if (value === "Hi") {
                    return 'Hi is not the same as Hello, enter "Hello"';
                }
                return value === "Hello" ? true : 'Please enter "Hello"';
            };

            return { args, requiredValidator, helloValidator };
        },
        template: `<ev-textfield v-bind="args" :validators="[requiredValidator, helloValidator]" />`,
    }),
};

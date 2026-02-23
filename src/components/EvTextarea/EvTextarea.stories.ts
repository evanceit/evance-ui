import type { Meta, StoryObj } from "@storybook/vue3";

import { EvTextarea } from "../EvTextarea";
import { InputAppearance } from "@/util";

const meta: Meta<typeof EvTextarea> = {
    component: EvTextarea,
    title: "Components/Forms/EvTextarea",
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
        label: {
            control: "text",
            description:
                "Optional label - may be supplied as a prop or within a slot.",
        },
        hint: {
            control: "text",
            description:
                "Optional hint appears below the label title smaller/lighter.",
        },
        modelValue: {
            control: "text",
            description:
                "The `model-value` is the `v-model` value of the component.",
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
        autogrow: {
            control: "boolean",
        },
        autoselect: {
            control: "boolean",
            description:
                "When `autoselect` is `true` any text within the input is selected on focus.",
        },
        autosubmit: {
            control: "select",
            options: [undefined, "() => { console.log('submitted') }"],
            mapping: {
                undefined: undefined,
                "() => { console.log('submitted') }": () => {
                    console.log("submitted");
                },
            },
            description:
                "Supply a function to `autosubmit` to intercept the enter key being pressed and execute the supplied function.",
        },
        clearable: {
            control: "boolean",
        },
        loading: {
            control: "boolean",
            description:
                "When `loading` is `true` a linear progress bar is added to the bottom of the textfield " +
                "in an indeterminate state. However, if an `icon` has been set, a circular progress progress bar " +
                "is used instead.",
        },
        maxlength: {
            control: "number",
            description:
                "The maximum string length (measured in UTF-16 code units) that the user can enter. " +
                "If this value isn't specified, the user can enter an unlimited number of characters.",
        },
    },
    args: {
        // Form Field Args
        disabled: false,
        error: false,
        id: undefined,
        modelValue: "A\nB\nC\nD\nE\nF\nG\nH",
        name: undefined,
        readonly: false,
        validateOn: "input",
        validators: undefined,
        // End

        label: undefined,
        appearance: InputAppearance.default,
        autofocus: false,
        autogrow: true,
        autoselect: false,
        clearable: false,
        loading: false,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvTextarea>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvTextarea },
        setup() {
            const requiredValidator = (value: any) => {
                if (!value) {
                    return "Required";
                }
                return true;
            };

            return { args, requiredValidator };
        },
        template: `<ev-textarea v-bind="args" :validators="[requiredValidator]" />`,
    }),
};

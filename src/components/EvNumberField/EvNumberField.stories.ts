import type { Meta, StoryObj } from "@storybook/vue3";

import { EvNumberField } from "../EvNumberField";
import { omit } from "@/util";

import EvTextfieldStories from "../EvTextfield/EvTextfield.stories";

const meta: Meta<typeof EvNumberField> = {
    component: EvNumberField,
    title: "Forms/EvNumberField",
    argTypes: {
        min: {
            control: "number",
            description: "The minimum boundary number.",
        },
        max: {
            control: "number",
            description: "The maximum boundary number.",
        },
        step: {
            control: "number",
            description:
                "The amount to increment when the +/- buttons are pressed, " +
                "or when the up/down arrows are pressed within the input." +
                "If the input is empty the `min` value will be used initially, or `0` if no `min` is supplied.",
        },
        minFractionDigits: {
            control: "number",
            description:
                "The minimum number of decimal places shown within the input field.",
        },
        maxFractionDigits: {
            control: "number",
            description:
                "The maximum number of decimal places. If the user enters a value with greater precision the value is changed.",
        },
        modelValue: {
            control: "number",
            description:
                "The `model-value` is the `v-model` value of the component.",
        },
        mode: {
            control: "select",
            options: ["decimal", "currency"],
            description:
                "The mode may either be set to `decimal` or `currency`. When using currency the `currency` prop is required " +
                "and the `minFractionDigits` and `maxFractionDigits` are automatically set those of the currency unless otherwise stated.",
        },
        currency: {
            control: "select",
            options: ["GBP", "USD"],
            description:
                "The ISO 4217 currency code when the `mode` is set to `currency`. Such as 'GBP' or 'USD'.",
        },
        showButtons: {
            control: "boolean",
            description: "Whether to show the +/- spinner buttons.",
        },
        useGrouping: {
            control: "boolean",
            description:
                "Whether to use thousand grouping separators when formatting the number.",
        },

        ...omit(EvTextfieldStories.argTypes as any, ["modelValue", "type"]),
    },
    args: {
        min: undefined,
        max: undefined,
        step: undefined,
        minFractionDigits: undefined,
        maxFractionDigits: undefined,
        mode: "decimal",
        currency: "GBP",
        showButtons: false,
        useGrouping: undefined,

        ...omit(EvTextfieldStories.args as any, ["type"]),
    },
};

export default meta;

type Story = StoryObj<typeof EvNumberField>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvNumberField },
        setup() {
            return { args };
        },
        template: `<ev-number-field v-bind="args" />`,
    }),
};

import type { Meta, StoryObj } from "@storybook/vue3";

import { EvDatePicker } from "../EvDatePicker";

const meta: Meta<typeof EvDatePicker> = {
    component: EvDatePicker,
    argTypes: {
        min: {
            control: "text",
            description:
                "The minimum permitted date. This may be provided as a string in `YYYY`, `YYYY-MM`, or `YYYYY-MM-DD` format. Or, as a JavaScript Date object.",
        },
        max: {
            control: "text",
            description:
                "The maximum permitted date. This may be provided as a string in `YYYY`, `YYYY-MM`, or `YYYYY-MM-DD` format. Or, as a JavaScript Date object.",
        },
        selectionMode: {
            control: "select",
            options: ["single", "multiple", "range"],
        },
        showAdjacentMonths: {
            control: "boolean",
        },
    },
    args: {
        min: null,
        max: null,
        selectionMode: "single",
        showAdjacentMonths: true,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvDatePicker>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvDatePicker },
        setup() {
            return { args };
        },
        data() {
            return {
                modelValue: null,
            };
        },
        template: `<p>{{modelValue}}</p>
        <ev-date-picker v-bind="args" v-model="modelValue" />`,
    }),
};

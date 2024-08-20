import type { Meta, StoryObj } from "@storybook/vue3";

import { EvQuickfind } from "../EvQuickfind";

const meta: Meta<typeof EvQuickfind> = {
    title: "Typography/EvQuickfind",
    component: EvQuickfind,
    argTypes: {
        modelValue: {
            control: "text",
            description: "Set via the `v-model` directive.",
        },
        bold: {
            control: "boolean",
        },
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
    },
    args: {
        modelValue: "146",
        bold: false,
        size: "medium",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvQuickfind>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvQuickfind },
        setup() {
            return { args };
        },
        template: '<ev-quickfind v-bind="args" />',
    }),
};

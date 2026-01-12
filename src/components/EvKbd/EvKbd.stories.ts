import type { Meta, StoryObj } from "@storybook/vue3";

import { EvKbd } from "../EvKbd";

const meta: Meta<typeof EvKbd> = {
    title: "Components/Typography/EvKbd",
    component: EvKbd,
    argTypes: {
        value: {
            control: "text",
            description: "The text to display as a keyboard item",
        },
        variant: {
            control: "select",
            options: ["default", "tonal", "outlined", "bold", "text"],
        },
    },
    args: {
        value: "Ctrl",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvKbd>;

export const Primary: Story = {
    render: (args) => ({
        components: { EvKbd },
        setup() {
            return { args };
        },
        template:
            'The keyboard button component <ev-kbd v-bind="args" /> + <ev-kbd v-bind="args" /> should remain inline',
    }),
};

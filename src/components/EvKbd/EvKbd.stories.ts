import type {Meta, StoryObj} from "@storybook/vue3";

import {EvKbd} from "../EvKbd";

const meta: Meta<typeof EvKbd> = {
    component: EvKbd,
    argTypes: {
        size: {
            control: "select",
            description: "The size of the item",
            options: ['small', 'medium', 'large']
        },
        value: {
            control: "text",
            description: "The text to display as a keyboard item"
        }
    },
    args: {
        size: undefined,
        value: 'Ctrl'
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvKbd>;

export const Primary: Story = {
    render: (args) =>  ({
        components: { EvKbd },
        setup() {
            return { args };
        },
        template: 'The keyboard button component <ev-kbd v-bind="args" /> + <ev-kbd v-bind="args" /> should remain inline'
    }),
};
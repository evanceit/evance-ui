import type { Meta, StoryObj } from "@storybook/vue3";

import { EvSwatch } from "../EvSwatch";

const meta: Meta<typeof EvSwatch> = {
    component: EvSwatch,
    argTypes: {

    },
    args: {

    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvSwatch>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvSwatch },
        setup() {
            return { args };
        },
        template: `<ev-swatch v-bind="args" />`,
    }),
};

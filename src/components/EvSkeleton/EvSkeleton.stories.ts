import type { Meta, StoryObj } from "@storybook/vue3";

import { EvSkeleton } from "../EvSkeleton";

const meta: Meta<typeof EvSkeleton> = {
    component: EvSkeleton,
    argTypes: {

    },
    args: {

    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvSkeleton>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvSkeleton },
        setup() {
            return { args };
        },
        template: `<ev-skeleton v-bind="args" />`,
    }),
};

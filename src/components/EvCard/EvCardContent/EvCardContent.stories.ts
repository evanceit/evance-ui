import type { Meta, StoryObj } from "@storybook/vue3";

import { EvCardContent } from "../EvCardContent";

const meta: Meta<typeof EvCardContent> = {
    component: EvCardContent,
    argTypes: {

    },
    args: {

    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvCardContent>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvCardContent },
        setup() {
            return { args };
        },
        template: `<ev-card-content v-bind="args" />`,
    }),
};

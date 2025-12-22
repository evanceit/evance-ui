import type { Meta, StoryObj } from "@storybook/vue3";

import { EvListGroup } from "../EvListGroup";

const meta: Meta<typeof EvListGroup> = {
    component: EvListGroup,
    title: "Components/Data/EvListGroup",
    argTypes: {

    },
    args: {

    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvListGroup>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvListGroup },
        setup() {
            return { args };
        },
        template: `
            <ev-list-group v-bind="args" />
        `,
    }),
};

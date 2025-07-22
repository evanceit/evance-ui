import type { Meta, StoryObj } from "@storybook/vue3";

import { EvListItemGroup } from "../EvListItemGroup";

const meta: Meta<typeof EvListItemGroup> = {
    component: EvListItemGroup,
    title: "Components/Data/EvListItemGroup",
    argTypes: {

    },
    args: {

    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvListItemGroup>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvListItemGroup },
        setup() {
            return { args };
        },
        template: `
            <ev-list-item-group v-bind="args" />
        `,
    }),
};

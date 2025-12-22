import type { Meta, StoryObj } from "@storybook/vue3";

import { EvListGroup } from "../EvListGroup";
import { EvListItem } from "../EvListItem";
import { DotIcon } from "../../icons";

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
        components: { EvListGroup, EvListItem },
        setup() {
            return { args, DotIcon };
        },
        template: `
            <ev-list-group v-bind="args">
                Default slot content
            </ev-list-group>
        `,
    }),
};

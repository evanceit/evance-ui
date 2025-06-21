import type { Meta, StoryObj } from "@storybook/vue3";

import { EvTag } from "../EvTag";
import { EvTagGroup } from "../EvTagGroup";

const meta: Meta<typeof EvTagGroup> = {
    component: EvTagGroup,
    title: "Components/Data/EvTagGroup",
    argTypes: {
        column: {
            control: "boolean",
        },
        filter: {
            control: "boolean",
        },
    },
    args: {
        column: false,
        filter: false,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvTagGroup>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvTagGroup, EvTag },
        setup() {
            const tags = [
                "Work",
                "Home Improvement",
                "Vacation",
                "Food",
                "Drawers",
                "Shopping",
                "Art",
                "Tech",
                "Creative Writing",
                "Tents",
                "Sleeping Mats",
                "Sleeping Bags",
                "Tarps",
            ];
            return { args, tags };
        },
        template: `
            <ev-tag-group v-bind="args">
                <ev-tag v-for="tag in tags" :key="tag">{{ tag }}</ev-tag>
            </ev-tag-group>
        `,
    }),
};

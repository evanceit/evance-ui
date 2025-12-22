import type { Meta, StoryObj } from "@storybook/vue3";

import { EvListGroup } from "../EvListGroup";
import { EvListItem } from "../EvListItem";
import { EvList } from "../EvList";
import { EvIcon } from "../EvIcon";

import EvListItemStories from "../EvListItem/EvListItem.stories";

const meta: Meta<typeof EvListGroup> = {
    component: EvListGroup,
    title: "Components/Data/EvListGroup",
    argTypes: {
        ...EvListItemStories.argTypes,
    },
    args: {
        ...EvListItemStories.args,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvListGroup>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvListGroup, EvListItem, EvList, EvIcon },
        setup() {
            return { args };
        },
        template: `
            <ev-list>
                <ev-list-group v-bind="args">
                    Default slot content
                </ev-list-group>
            </ev-list>
            
        `,
    }),
};

import type {Meta, StoryObj} from "@storybook/vue3";

import { EvListItem } from "../EvListItem";

const meta: Meta<typeof EvListItem> = {
    component: EvListItem,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvListItem>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvListItem },
        setup() {
            return { args };
        },
        template: '<ev-list-item v-bind="args">{{ args.default }}</ev-list-item>'
    })
};
import type {Meta, StoryObj} from "@storybook/vue3";

import { EvTag } from "../EvTag";
import { EvTagGroup } from "../EvTagGroup";

const meta: Meta<typeof EvTagGroup> = {
    component: EvTagGroup,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvTagGroup>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvTagGroup, EvTag },
        setup() {
            const tags = [
                'Work',
                'Home Improvement',
                'Vacation',
                'Food',
                'Drawers',
                'Shopping',
                'Art',
                'Tech',
                'Creative Writing',
            ];
            return { args, tags };
        },
        template: `
            <ev-tag-group v-bind="args">
                <ev-tag v-for="tag in tags" :key="tag">{{ tag }}</ev-tag>
            </ev-tag-group>
        `
    })
};
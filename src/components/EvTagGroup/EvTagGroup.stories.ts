import type {Meta, StoryObj} from "@storybook/vue3";

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
        components: { EvTagGroup },
        setup() {
            return { args };
        },
        template: `
            <ev-tag-group v-bind="args" />
        `
    })
};
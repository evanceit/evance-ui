import type {Meta, StoryObj} from "@storybook/vue3";

import { EvSlideGroup } from "../EvSlideGroup";

const meta: Meta<typeof EvSlideGroup> = {
    component: EvSlideGroup,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvSlideGroup>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvSlideGroup },
        setup() {
            return { args };
        },
        template: `
            <ev-slide-group v-bind="args">Hello</ev-slide-group>
        `
    })
};
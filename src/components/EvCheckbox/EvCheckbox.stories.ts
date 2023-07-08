import type {Meta, StoryObj} from "@storybook/vue3";

import { EvCheckbox } from "../EvCheckbox";

const meta: Meta<typeof EvCheckbox> = {
    component: EvCheckbox,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvCheckbox>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvCheckbox },
        setup() {
            return { args };
        },
        template: '<ev-checkbox v-bind="args" />'
    })
};
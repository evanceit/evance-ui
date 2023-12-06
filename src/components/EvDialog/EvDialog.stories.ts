import type {Meta, StoryObj} from "@storybook/vue3";

import { EvDialog } from "../EvDialog";

const meta: Meta<typeof EvDialog> = {
    component: EvDialog,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvDialog>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvDialog },
        setup() {
            return { args };
        },
        template: '<ev-dialog v-bind="args" />'
    })
};
import type {Meta, StoryObj} from "@storybook/vue3";

import { EvTag } from "../EvTag";

const meta: Meta<typeof EvTag> = {
    component: EvTag,
    argTypes: {
        closable: {
            control: 'boolean'
        }
    },
    args: {
        closable: false
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvTag>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvTag },
        setup() {

            return { args };
        },
        template: `<ev-tag v-bind="args" />`
    })
};
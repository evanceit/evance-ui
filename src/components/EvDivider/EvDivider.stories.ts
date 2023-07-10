import type {Meta, StoryObj} from "@storybook/vue3";

import { EvDivider } from "../EvDivider";

const meta: Meta<typeof EvDivider> = {
    component: EvDivider,
    argTypes: {
        appearance: {
            control: 'select',
            options: ['solid', 'dashed', 'dotted']
        },
        vertical: {
            control: 'boolean'
        },
        default: {
            control: 'text'
        }
    },
    args: {
        appearance: 'solid',
        vertical: false,
        default: null
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvDivider>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvDivider },
        setup() {
            return { args };
        },
        template: '<div style="height: 200px; display: flex; align-items: center; justify-content: center">' +
            '<ev-divider v-bind="args">{{ args.default }}</ev-divider>' +
            '</div>'
    })
};
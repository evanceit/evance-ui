import type {Meta, StoryObj} from "@storybook/vue3";

import { EvLozenge } from "../EvLozenge";

const meta: Meta<typeof EvLozenge> = {
    component: EvLozenge,
    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content'
        },
        bold: {
            control: 'boolean',
            description: "Whether to apply a solid background, giving the component a bolder appearance."
        },
        appearance: {
            control: 'select',
            options: ['default', 'critical', 'information', 'notice', 'success', 'warning'],
            description: "Appearance may be: `default`, `critical`, `information`, `notice`, `success`, or `warning`."
        },
        maxWidth: {
            control: 'text',
            description: 'May also be supplied as `max-width`.'
        }
    },
    args: {
        default: 'Example',
        bold: false,
        appearance: 'default'
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvLozenge>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvLozenge },
        setup() {
            return { args };
        },
        template: '<ev-lozenge v-bind="args">{{ args.default }}</ev-lozenge>'
    })
};
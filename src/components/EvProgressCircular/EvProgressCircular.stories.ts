import type {Meta, StoryObj} from "@storybook/vue3";

import { EvProgressCircular } from "../EvProgressCircular";

const meta: Meta<typeof EvProgressCircular> = {
    component: EvProgressCircular,
    argTypes: {
        default: {
            control: 'text'
        },
        appearance: {
            control: 'select',
            options: ['default', 'critical', 'information', 'primary', 'success', 'warning']
        },
        indeterminate: {
            control: 'boolean',
            description: 'Using the `indeterminate` prop causes the component to animate indefinitely.'
        },
        percentage: {
            control: {
                type: 'range',
                min: 0,
                max: 100
            }
        },
        rotate: {
            control: {
                type: 'range',
                min: 0,
                max: 359
            }
        },
        size: {
            control: {
                type: 'range',
                min: 16,
                max: 100
            }
        },
        thickness: {
            control: {
                type: 'range',
                min: 1,
                max: 100
            }
        }
    },
    args: {
        appearance: 'default',
        default: '',
        indeterminate: false,
        percentage: 0,
        rotate: 0,
        size: 20,
        thickness: 2
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvProgressCircular>;

export const Primary: Story = {
    render: (args) =>  ({
        components: { EvProgressCircular },
        setup() {
            return { args };
        },
        template: '<ev-progress-circular v-bind="args">{{ args.default }}</ev-progress-circular>'
    })
};
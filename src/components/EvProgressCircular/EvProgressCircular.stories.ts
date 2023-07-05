import type {Meta, StoryObj} from "@storybook/vue3";

import { EvProgressCircular } from "../EvProgressCircular";

const meta: Meta<typeof EvProgressCircular> = {
    component: EvProgressCircular,
    argTypes: {
        default: {
            control: 'text',
            description: "Allows any content to be placed in the middle of the progress circle. "
                + "The content does NOT inherit `appearance`."
        },
        appearance: {
            control: 'select',
            options: ['default', 'critical', 'information', 'primary', 'success', 'warning'],
            description: "The `default` appearance inherits the current color."
        },
        indeterminate: {
            control: 'boolean',
            description: 'Using the `indeterminate` prop causes the component to animate indefinitely.'
        },
        percentage: {
            if: {
                arg: 'indeterminate',
                truthy: false
            },
            control: {
                type: 'range',
                min: 0,
                max: 100
            },
            description: 'Progress is shown as a percentage from 0 to 100. Percentage is ignored when `indeterminate` is set to `true`.'
        },
        rotate: {
            if: {
                arg: 'indeterminate',
                truthy: false
            },
            control: {
                type: 'range',
                min: 0,
                max: 359
            },
            description: 'Set the progress bar starting angle in degrees. Defaults to `0` which, like a clock, is at the top and rotates clockwise.'
        },
        size: {
            control: {
                type: 'range',
                min: 16,
                max: 200
            },
            description: 'The `default` size is `20px x 20px`, which allows an `indeterminate` progress bar to be shown within other components such as buttons. '
                + "Accepts a numeric size - if no units are provided `px` is assumed."
        },
        thickness: {
            control: {
                type: 'range',
                min: 1,
                max: 100
            },
            description: "The thickness/width of the progress bar may be supplied as a numeric value. "
                + "The thickness has a maximum value of half the `size`, at which point the progress bar looks like a pie chart."
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
    render: (args: any) =>  ({
        components: { EvProgressCircular },
        setup() {
            return { args };
        },
        template: '<ev-progress-circular v-bind="args">{{ args.default }}</ev-progress-circular>'
    })
};
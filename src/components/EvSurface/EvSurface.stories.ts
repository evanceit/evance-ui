import type {Meta, StoryObj} from "@storybook/vue3";

import { EvSurface } from "../EvSurface";

const meta: Meta<typeof EvSurface> = {
    component: EvSurface,
    argTypes: {
        elevation: {
            control: 'select',
            options: ['default', 'panel', 'overlay', 'sunken']
        },
        rounded: {
            control: 'select',
            options: ['false', 'true', 'small', 'medium', 'large'],
            mapping: {
                'false': false,
                'true': true
            }
        }
    },
    args: {
        elevation: 'default',
        rounded: false
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvSurface>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvSurface },
        setup() {
            return { args };
        },
        template: '<ev-surface v-bind="args" width="200" height="200" />'
    })
};
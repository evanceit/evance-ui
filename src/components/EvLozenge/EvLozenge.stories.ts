import type {Meta, StoryObj} from "@storybook/vue3";

import { EvLozenge } from "../EvLozenge";
import {Appearance, Variant} from "@/util";

const meta: Meta<typeof EvLozenge> = {
    component: EvLozenge,
    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content'
        },
        appearance: {
            control: 'select',
            options: Object.values(Appearance),
            description: "Appearance may be: `default`, `danger`, `information`, `notice`, `success`, or `warning`."
        },
        maxWidth: {
            control: 'text',
            description: 'May also be supplied as `max-width`.'
        },
        variant: {
            control: 'select',
            options: Object.values(Variant),
            description: "Whether to apply a solid background, giving the component a bolder appearance."
        },
    },
    args: {
        default: 'Example',
        appearance: 'default',
        variant: 'default'
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
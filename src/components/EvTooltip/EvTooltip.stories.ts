import type {Meta, StoryObj} from "@storybook/vue3";

import {EvTooltip, EvButton} from "../../components";

const meta: Meta<typeof EvTooltip> = {
    component: EvTooltip,
    argTypes: {
        modelValue: {
            control: 'boolean'
        }
    },
    args: {
        modelValue: false
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvTooltip>;

export const Primary: Story = {
    render: (args) =>  ({
        components: { EvTooltip, EvButton },
        setup() {
            return { args };
        },
        template: `
            <ev-button>
                Left
                <ev-tooltip activator="parent" position="left"><code>position="left"</code></ev-tooltip>
            </ev-button>
            &nbsp;
            <ev-button>
                Top
                <ev-tooltip activator="parent" v-bind="args"><code>position="top"</code> (default)</ev-tooltip>
            </ev-button>
            &nbsp;
            <ev-button>
                Bottom
                <ev-tooltip activator="parent" position="bottom"><code>position="bottom"</code></ev-tooltip>
            </ev-button>
            &nbsp;
            <ev-button>
                Right
                <ev-tooltip activator="parent" position="right"><code>position="right"</code></ev-tooltip>
            </ev-button>
        `
    }),
};
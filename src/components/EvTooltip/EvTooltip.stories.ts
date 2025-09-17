import type { Meta, StoryObj } from "@storybook/vue3";

import { EvTooltip, EvButton } from "../../components";

const meta: Meta<typeof EvTooltip> = {
    component: EvTooltip,
    title: "Components/Overlays/EvTooltip",
    argTypes: {
        modelValue: {
            control: "boolean",
        },
        position: {
            control: "select",
            options: ["top", "bottom", "left", "right"],
        },
    },
    args: {
        modelValue: false,
        position: "top",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvTooltip>;

export const Primary: Story = {
    render: (args) => ({
        components: { EvTooltip, EvButton },
        setup() {
            return { args };
        },
        template: `
            <ev-button>
                Activator
                <ev-tooltip activator="parent" v-bind="args"><code>position="{{ args.position }}"</code></ev-tooltip>
            </ev-button>
        `,
    }),
};

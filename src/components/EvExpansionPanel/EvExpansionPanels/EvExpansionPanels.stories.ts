import type { Meta, StoryObj } from "@storybook/vue3";

import { EvExpansionPanel, EvExpansionPanels } from "@/components";

const meta: Meta<typeof EvExpansionPanels> = {
    component: EvExpansionPanels,
    title: "Components/Layout/EvExpansionPanels",
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "accordion", "spaced"],
            description: "Variant of the expansion panels",
        },
    },
    args: {
        variant: "default",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvExpansionPanels>;

export const Primary: Story = {
    render: (args) => ({
        components: { EvExpansionPanel, EvExpansionPanels },
        setup() {
            return { args };
        },
        template: `
            <ev-expansion-panels v-bind="args">
                <ev-expansion-panel title="Example 1">
                    This is some test content
                </ev-expansion-panel>
                <ev-expansion-panel title="Example 2">
                    This is some test content
                </ev-expansion-panel>
                <ev-expansion-panel title="Example 3">
                    This is some test content
                </ev-expansion-panel>
                <ev-expansion-panel title="Example 4">
                    This is some test content
                </ev-expansion-panel>
            </ev-expansion-panels>
        `,
    }),
};

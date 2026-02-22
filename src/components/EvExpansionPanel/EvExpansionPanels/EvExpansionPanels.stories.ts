import type { Meta, StoryObj } from "@storybook/vue3";

import { EvExpansionPanel, EvExpansionPanels, EvButton } from "@/components";
import { computed, ref } from "vue";
import { ExpandYIcon, CollapseYIcon } from "@/icons";

const meta: Meta<typeof EvExpansionPanels> = {
    component: EvExpansionPanels,
    title: "Components/Layout/EvExpansionPanels",
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "accordion", "spaced"],
            description: "Variant of the expansion panels",
        },
        multiple: {
            control: "boolean",
            description: "Allow multiple panels to be expanded at once",
        },
    },
    args: {
        variant: "default",
        multiple: false,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvExpansionPanels>;

export const Primary: Story = {
    render: (args) => ({
        components: { EvExpansionPanel, EvExpansionPanels, EvButton },
        setup() {
            const panelsRef = ref(null);

            const hasExpandedPanels = computed(
                () => panelsRef.value?.hasExpanded,
            );

            function toggleExpandAll() {
                hasExpandedPanels.value
                    ? panelsRef.value.collapseAll()
                    : panelsRef.value.expandAll();
            }

            return {
                args,
                panelsRef,
                toggleExpandAll,
                hasExpandedPanels,
                ExpandYIcon,
                CollapseYIcon,
            };
        },
        template: `
            <p>
                <ev-button 
                    v-if="!hasExpandedPanels" 
                    :icon-start="ExpandYIcon" 
                    @click="toggleExpandAll">Expand all</ev-button>
                <ev-button 
                    v-else 
                    @click="toggleExpandAll" 
                    :icon-start="CollapseYIcon">Collapse all</ev-button>
            </p>
            
            <ev-expansion-panels ref="panelsRef" v-bind="args">
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

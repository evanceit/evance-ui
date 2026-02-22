import type { Meta, StoryObj } from "@storybook/vue3";

import { EvExpansionPanel } from "../EvExpansionPanel";
import { CheckIcon, EllipsisIcon, SettingsIcon } from "@/icons";
import {
    EvButtonProps,
    EvExpansionPanels,
    EvLozenge,
    EvThumbnail,
    EvCode,
} from "@/components";

const meta: Meta<typeof EvExpansionPanel> = {
    component: EvExpansionPanel,
    title: "Components/Layout/EvExpansionPanel",
    argTypes: {
        title: {
            control: "text",
        },
        iconStart: {
            control: "select",
            options: [undefined, "SettingsIcon"],
            mapping: {
                SettingsIcon: SettingsIcon,
            },
        },
        noPadding: {
            control: "boolean",
        },
    },
    args: {
        title: "My panel",
        iconStart: undefined,
        noPadding: false,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvExpansionPanel>;

export const Primary: Story = {
    render: (args) => ({
        components: {
            EvExpansionPanel,
            EvExpansionPanels,
            EvLozenge,
            EvThumbnail,
            EvCode,
        },
        setup() {

            const actions: EvButtonProps[] = [
                {
                    icon: EllipsisIcon,
                },
            ];

            const actionsOnHover: EvButtonProps[] = [
                {
                    icon: CheckIcon,
                },
            ];

            return { args, actions, actionsOnHover };
        },
        template: `
            <ev-expansion-panels>
                <ev-expansion-panel v-bind="args">

                    This is some test content
                </ev-expansion-panel>

                <ev-expansion-panel title="Example 2">
                    <template #header-suffix>
                        <ev-lozenge>inactive</ev-lozenge>
                    </template>
                    <template #header-prefix>
                        <ev-thumbnail size="small" />
                    </template>
                    This example includes the use of the
                    <ev-code>header-prefix</ev-code> and the
                    <ev-code>header-suffix</ev-code> slots.
                </ev-expansion-panel>

                <ev-expansion-panel title="Example 3"
                                    :actions="actions"
                                    :actions-on-hover="actionsOnHover">
                    <template #header-suffix>
                        <ev-lozenge>inactive</ev-lozenge>
                    </template>
                    <template #header-prefix>
                        <ev-thumbnail size="small" />
                    </template>
                    This extends "Example 2" further by including the use of the
                    <ev-code>actions</ev-code> and the
                    <ev-code>actions-on-hover</ev-code> props.
                </ev-expansion-panel>
            </ev-expansion-panels>
        `,
    }),
};

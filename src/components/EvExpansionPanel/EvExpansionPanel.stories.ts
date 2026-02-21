import type { Meta, StoryObj } from "@storybook/vue3";

import { EvExpansionPanel } from "../EvExpansionPanel";
import { CheckIcon, EllipsisIcon, SettingsIcon } from "../../icons";
import { EvButtonProps } from "../EvButton";
import { EvExpansionPanels } from "./EvExpansionPanels";

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
                "SettingsIcon": SettingsIcon,
            }
        },
        noPadding: {
            control: "boolean",
        }
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
        components: { EvExpansionPanel, EvExpansionPanels },
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
                <ev-expansion-panel v-bind="args"
                                    :actions="actions"
                                    :actions-on-hover="actionsOnHover">
                    This is some test content
                </ev-expansion-panel>
            </ev-expansion-panels>
        `,
    }),
};

import type { Meta, StoryObj } from "@storybook/vue3";

import { EvSwitchButton } from "../EvSwitchButton";
import { MinusIcon, PlusIcon, LockOpenIcon, LockFillIcon } from "../../icons";

const meta: Meta<typeof EvSwitchButton> = {
    component: EvSwitchButton,
    title: "Components/Actions/EvSwitchButton",
    argTypes: {
        modelValue: {
            control: "boolean",
        },
        text: {
            control: "text",
        },
        selectedText: {
            control: "text",
        },
        icon: {
            control: "select",
            options: [undefined, "MinusIcon", "LockOpenIcon"],
            mapping: {
                MinusIcon: MinusIcon,
                LockOpenIcon: LockOpenIcon,
            },
        },
        selectedIcon: {
            control: "select",
            options: ["None", "PlusIcon", "LockFillIcon"],
            mapping: {
                PlusIcon: PlusIcon,
                LockFillIcon: LockFillIcon,
            },
        },
    },
    args: {
        modelValue: false,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvSwitchButton>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvSwitchButton },
        setup() {

            return { args };
        },
        template: `<ev-switch-button v-bind="args" variant="subtle" selected-variant="subtle" />`,
    }),
};

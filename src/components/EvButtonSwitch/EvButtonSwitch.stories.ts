import type { Meta, StoryObj } from "@storybook/vue3";

import { EvButtonSwitch } from "../EvButtonSwitch";
import {
    MinusIcon,
    PlusIcon,
    LockOpenIcon,
    LockFillIcon,
    AsideClosedIcon,
    AsideOpenIcon,
} from "../../icons";

const meta: Meta<typeof EvButtonSwitch> = {
    component: EvButtonSwitch,
    title: "Components/Actions/EvButtonSwitch",
    argTypes: {
        modelValue: {
            control: "boolean",
        },
        appearance: {
            control: "select",
            options: [
                "default",
                "danger",
                "information",
                "notice",
                "primary",
                "success",
                "warning",
            ],
        },
        variant: {
            control: "select",
            options: ["default", "bold", "outlined", "subtle", "tonal", "link"],
        },
        selectedAppearance: {
            control: "select",
            options: [
                "default",
                "danger",
                "information",
                "notice",
                "primary",
                "success",
                "warning",
            ],
        },
        selectedVariant: {
            control: "select",
            options: ["default", "bold", "outlined", "subtle", "tonal", "link"],
        },
        text: {
            control: "text",
        },
        selectedText: {
            control: "text",
        },
        icon: {
            control: "select",
            options: [
                undefined,
                "MinusIcon",
                "LockOpenIcon",
                "AsideClosedIcon",
            ],
            mapping: {
                MinusIcon: MinusIcon,
                LockOpenIcon: LockOpenIcon,
                AsideClosedIcon: AsideClosedIcon,
            },
        },
        selectedIcon: {
            control: "select",
            options: ["None", "PlusIcon", "LockFillIcon", "AsideOpenIcon"],
            mapping: {
                PlusIcon: PlusIcon,
                LockFillIcon: LockFillIcon,
                AsideOpenIcon: AsideOpenIcon,
            },
        },
        disabled: {
            control: "boolean",
        },
        readonly: {
            control: "boolean",
        },
    },
    args: {
        modelValue: false,
        appearance: undefined,
        selectedAppearance: undefined,
        variant: undefined,
        selectedVariant: undefined,
        text: "OFF",
        selectedText: "ON",
        icon: undefined,
        selectedIcon: undefined,
        disabled: false,
        readonly: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvButtonSwitch>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvButtonSwitch },
        setup() {

            return { args };
        },
        template: `<ev-button-switch v-bind="args" />`,
    }),
};

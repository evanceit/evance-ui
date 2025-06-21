import type { Meta, StoryObj } from "@storybook/vue3";

import { EvBadge } from "../EvBadge";
import { CancelIcon, CheckIcon, EvanceIcon } from "@/icons";
import { EvBlock, EvIcon, EvLayout } from "@/components";

const meta: Meta<typeof EvBadge> = {
    component: EvBadge,
    title: "Components/Feedback/EvBadge",
    argTypes: {
        appearance: {
            control: "select",
            options: [
                "default",
                "danger",
                "information",
                "notice",
                "success",
                "warning",
            ],
        },
        bold: {
            control: "boolean",
        },
        bordered: {
            control: "boolean",
        },
        content: {
            control: {
                type: "range",
                min: 0,
                max: 100,
            },
        },
        dot: {
            control: "boolean",
        },
        floating: {
            control: "boolean",
        },
        icon: {
            control: "select",
            options: ["undefined", "CheckIcon", "CancelIcon"],
            mapping: {
                undefined: undefined,
                CheckIcon: CheckIcon,
                CancelIcon: CancelIcon,
            },
        },
        inline: {
            control: "boolean",
        },
        max: {
            control: "number",
        },
        modelValue: {
            control: "boolean",
        },
        position: {
            control: "select",
            options: [
                "top-start",
                "top-center",
                "top-end",
                "bottom-start",
                "bottom-center",
                "bottom-end",
                "left-center",
                "right-center",
            ],
        },
        pulsate: {
            control: "boolean",
        },
    },
    args: {
        appearance: undefined,
        bold: false,
        bordered: false,
        content: undefined,
        dot: false,
        floating: false,
        icon: undefined,
        inline: false,
        max: undefined,
        modelValue: true,
        position: undefined,
        pulsate: false,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvBadge>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvBadge, EvIcon, EvLayout, EvBlock },
        setup() {
            return { EvIcon, EvanceIcon, args };
        },
        template: `

        <ev-layout>
            <ev-block>
                <p>Positioned relative to the default slot content.</p>
                <ev-badge v-bind="args">
                    <ev-icon :glyph="EvanceIcon" size="large" />
                </ev-badge>
            </ev-block>
            <ev-block>
                <p>Or, inline if the default slot is unused</p>
                <ev-badge v-bind="args" />
            </ev-block>
        </ev-layout>

        `,
    }),
};

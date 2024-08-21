import type { Meta, StoryObj } from "@storybook/vue3";

import { EvCardActions } from "../EvCardActions";
import { EvButtonProps } from "@/components";
import { ArrowContinueIcon } from "@/icons";

const meta: Meta<typeof EvCardActions> = {
    component: EvCardActions,
    argTypes: {
        justify: {
            control: "select",
            options: [
                "end",
                "start",
                "center",
                "space-between",
                "space-around",
                "space-evenly",
            ],
        },
        size: {
            control: "select",
            options: ["small", "medium", "large", "x-large"],
        },
    },
    args: {
        justify: "end",
        size: "medium",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvCardActions>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvCardActions },
        setup() {
            const items: EvButtonProps[] = [
                {
                    text: "Cancel",
                },
                {
                    appearance: "primary",
                    iconEnd: ArrowContinueIcon,
                    text: "Continue",
                },
            ];

            return { args, items };
        },
        template: `<ev-card-actions v-bind="args" :items="items" />`,
    }),
};

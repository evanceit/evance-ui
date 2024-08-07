import type { Meta, StoryObj } from "@storybook/vue3";

import { EvButtonGroup } from "../EvButtonGroup";
import { EvButton } from "@/components";

const meta: Meta<typeof EvButtonGroup> = {
    component: EvButtonGroup,
    argTypes: {
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
        size: {
            control: "select",
            options: ["x-small", "small", "medium", "large", "x-large"],
        },
        rounded: {
            control: "boolean",
        },
    },
    args: {
        appearance: "default",
        variant: "outlined",
        size: "medium",
        rounded: false,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvButtonGroup>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvButtonGroup, EvButton },
        setup() {
            return { args };
        },
        template: `
    <ev-button-group v-bind="args">
        <ev-button>Button 1</ev-button>
        <ev-button>Button 2</ev-button>
        <ev-button>Button 3</ev-button>
    </ev-button-group>`,
    }),
};

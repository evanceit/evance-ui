import type { Meta, StoryObj } from "@storybook/vue3";

import { EvSkeleton } from "../EvSkeleton";

const meta: Meta<typeof EvSkeleton> = {
    component: EvSkeleton,
    argTypes: {
        inline: {
            type: "boolean",
        },
        type: {
            control: "select",
            options: [
                "undefined",
                "avatar",
                "button",
                "heading",
                "image",
                "text",
            ],
            mapping: {
                undefined: undefined,
            },
        },
        size: {
            control: "select",
            options: [
                "undefined",
                "x-small",
                "small",
                "medium",
                "large",
                "x-large",
                "xx-large",
            ],
            mapping: {
                undefined: undefined,
            },
        },
        width: {
            control: "text",
        },
        height: {
            control: "text",
        },
        aspectRatio: {
            control: "select",
            options: [
                "undefined",
                "1:1",
                "4:3",
                "3:4",
                "16:9",
                "21:9",
            ],
            mapping: {
                undefined: undefined,
            },
        },
    },
    args: {
        inline: undefined,
        type: undefined,
        size: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvSkeleton>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvSkeleton },
        setup() {
            return { args };
        },
        template: `<ev-skeleton v-bind="args" />`,
    }),
};

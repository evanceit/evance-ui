import type { Meta, StoryObj } from "@storybook/vue3";

import { EvResponsive } from "../EvResponsive";

const meta: Meta<typeof EvResponsive> = {
    component: EvResponsive,
    argTypes: {
        aspectRatio: {
            control: "select",
            options: ["0.5", "1", "4:3", "16/9"],
            description:
                "Supports a number or a string. " +
                "Strings may be expressed as a division such as `16/9` or as a ratio `16:9`. " +
                "Numbers may be expressed as a decimal of `width/height`.",
        },
        inline: {
            control: "boolean",
        },
        default: {
            control: "text",
            description:
                "The default slot represents wrapped content within a non-flex inner `<div>`. " +
                "If you would like your inner content to be subject to the flex box of the responsive block you" +
                "should use the additional slot.",
        },
        contentClass: {
            control: "text",
            description:
                "Adds a class to the content wrapper when using the `content` slot.",
        },
        additional: {
            control: "text",
            description:
                "The additional slot represents unwrapped content subject to the flex of the outer `<div>`.",
        },
    },
    args: {
        aspectRatio: undefined,
        inline: false,
        default: "Hello World!",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvResponsive>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvResponsive },
        setup() {
            return { args };
        },
        template: `<ev-responsive v-bind="args">{{ args.default }}</ev-responsive>`,
    }),
};

import type { Meta, StoryObj } from "@storybook/vue3";

import { EvText } from "../EvText";

const meta: Meta<typeof EvText> = {
    title: "Typography/EvText",
    component: EvText,
    argTypes: {
        appearance: {
            control: "select",
            options: [
                undefined,
                "default",
                "danger",
                "information",
                "inverse",
                "notice",
                "primary",
                "subtle",
                "success",
                "warning"
            ]
        },
        size: {
            control: "select",
            options: [undefined, "x-large", "large", "medium", "small"],
        },
        tag: {
            control: "text",
        },
        text: {
            control: "text",
            description: "May also be provided to the default slot.",
        },
        truncate: {
            control: "select",
            options: [true, 1, 2, 3],
            description:
                "Truncate results in ellipsis and accepts either a `boolean` or a `number`. " +
                "Supplying `true` is standard behaviour resulting in a single line truncated by overflow. " +
                "Supplying a `number` is experimental and sets a maximum number of lines.",
        },
        weight: {
            control: "select",
            options: [undefined, "regular", "medium", "semibold", "bold"],
        },
    },
    args: {
        appearance: undefined,
        size: undefined,
        tag: undefined,
        text: "This is a very long text which I am hoping I can get to wrap onto another line",
        truncate: false,
        weight: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvText>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvText },
        setup() {
            return { args };
        },
        template: `<ev-text v-bind="args" />`,
    }),
};

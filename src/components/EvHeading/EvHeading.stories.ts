import type { Meta, StoryObj } from "@storybook/vue3";

import { EvHeading } from "../EvHeading";

const meta: Meta<typeof EvHeading> = {
    title: "Typography/EvHeading",
    component: EvHeading,
    argTypes: {
        size: {
            control: "select",
            options: [
                "xx-large",
                "x-large",
                "large",
                "medium",
                "small",
                "x-small",
            ],
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
    },
    args: {
        size: "medium",
        tag: undefined,
        text: "This is a very long heading which I am hoping I can get to wrap onto another line",
        truncate: false,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvHeading>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvHeading },
        setup() {
            return { args };
        },
        template: `<ev-heading v-bind="args" />`,
    }),
};

import type { Meta, StoryObj } from "@storybook/vue3";
import { EvEyebrow } from "@/components";

const meta: Meta<typeof EvEyebrow> = {
    title: "Components/Typography/EvEyebrow",
    component: EvEyebrow,
    argTypes: {
        appearance: {
            control: "select",
            options: [
                "default",
                "subtle",
                "primary",
                "danger",
                "notice",
                "success",
                "warning",
                "information",
            ],
        },
        text: {
            control: "text",
            description:
                "You can supply text as a prop or use the `default` slot.",
        },
    },
    args: {
        appearance: "default",
        text: "Example eyebrow",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvEyebrow>;

export const Primary: Story = {
    render: (args) => ({
        components: { EvEyebrow },
        setup() {
            return { args };
        },
        template: `<ev-eyebrow v-bind="args" />`,
    }),
};

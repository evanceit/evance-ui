import type { Meta, StoryObj } from "@storybook/vue3";

import { EvCardContent } from "../EvCardContent";
import { HelpIcon, ShieldIcon } from "@/icons";

const meta: Meta<typeof EvCardContent> = {
    component: EvCardContent,
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
        description: {
            control: "text",
            description:
                "The main content/description may be supplied as a prop. " +
                "You can supply a string, an array of strings, or an array of `EvTextProps`. " +
                "For full control use the `default` slot.",
        },
        eyebrow: {
            control: "text",
        },
        icon: {
            control: "select",
            options: [undefined, "HelpIcon", "ShieldIcon"],
            mapping: {
                HelpIcon: HelpIcon,
                ShieldIcon: ShieldIcon,
            },
        },
        size: {
            control: "select",
            options: ["small", "medium", "large", "x-large"],
        },
        title: {
            control: "text",
            description: "Example card title",
        },
    },
    args: {
        appearance: "default",
        description:
            "The main content/description may be supplied as a prop or using the default slot. ",
        eyebrow: undefined,
        icon: undefined,
        title: "Example card title",
        size: "medium",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvCardContent>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvCardContent },
        setup() {
            return { args };
        },
        template: `<ev-card-content v-bind="args" />`,
    }),
};

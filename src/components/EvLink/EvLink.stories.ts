import type { Meta, StoryObj } from "@storybook/vue3";
import { EvLink } from "../EvLink";
import { ArrowBackIcon, ArrowContinueIcon } from "@/icons";
import { LinkExternalIcon } from "@/icons/editor";

const meta: Meta<typeof EvLink> = {
    component: EvLink,
    title: "Components/Navigation/EvLink",
    argTypes: {
        appearance: {
            control: "select",
            options: ["default", "subtle"],
        },
        disabled: {
            control: "boolean",
            description: "You can disable a link.",
        },
        iconEnd: {
            control: "select",
            options: ["undefined", "LinkExternalIcon", "ArrowContinueIcon"],
            mapping: {
                undefined: undefined,
                LinkExternalIcon: LinkExternalIcon,
                ArrowContinueIcon: ArrowContinueIcon,
            },
        },
        iconStart: {
            control: "select",
            options: ["undefined", "ArrowBackIcon"],
            mapping: {
                undefined: undefined,
                ArrowBackIcon: ArrowBackIcon,
            },
        },
        target: {
            control: "select",
            options: [undefined, "_blank"],
            description:
                'If a `target="_blank"` an `LinkExternalIcon` is automatically added to the `icon-end` prop, unless otherwise provided.',
        },
        text: {
            control: "text",
            description:
                "The text to display. You can also use the `default` slot.",
        },
    },
    args: {
        disabled: false,
        text: "Example Link",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvLink>;

export const Primary: Story = {
    render: (args) => ({
        components: { EvLink },
        setup() {
            return { args };
        },
        template: `<ev-link v-bind="args" />`,
    }),
};

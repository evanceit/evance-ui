import type { Meta, StoryObj } from "@storybook/vue3";

import { EvCard } from "../EvCard";
import { EvButtonProps } from "@/components";
import { ArrowContinueIcon, HelpIcon, ShieldIcon } from "@/icons";

const meta: Meta<typeof EvCard> = {
    component: EvCard,
    argTypes: {
        actions: {
            description:
                "Accepts an array of `EvButtonProps` to the `actions` prop.",
        },
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
            description: "Changes the appearance of the card.",
        },
        elevation: {
            control: "select",
            options: ["default", "panel", "overlay", "sunken"],
            description: "Sets the main background colour of the card.",
        },
        eyebrow: {
            control: "text",
            description: "Appears above the title",
        },
        icon: {
            control: "select",
            options: [undefined, "HelpIcon", "ShieldIcon"],
            mapping: {
                HelpIcon: HelpIcon,
                ShieldIcon: ShieldIcon,
            },
        },
        rounded: {
            control: "select",
            options: [false, true, "small", "medium", "large"],
        },
        size: {
            control: "select",
            options: ["small", "medium", "large", "x-large"],
        },
        tag: {
            control: "select",
            options: ["a", "div"],
        },
        text: {
            control: "text",
            description:
                "The text to show below the heading/title may be supplied as a string, an array of strings or " +
                "an array of `EvText` props. You may also use the `default` slot.",
        },
        title: {
            control: "text",
            description: "The heading/title for the card",
        },
        variant: {
            control: "select",
            options: ["default", "bold", "outlined", "subtle", "tonal"],
            description: "Changes the appearance of the card.",
        },
    },
    args: {
        actions: undefined,
        appearance: "default",
        elevation: "panel",
        eyebrow: "Example",
        icon: undefined,
        rounded: true,
        size: "medium",
        tag: undefined,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!",
        title: "My example card",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvCard>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvCard },
        setup() {

            const actions: EvButtonProps[] = [
                {
                    text: "Cancel",
                },
                {
                    text: "Continue",
                    iconEnd: ArrowContinueIcon,
                    appearance: "primary",
                },
            ];

            return { args, actions };
        },
        template: `<ev-card v-bind="args" :actions="actions" />`,
    }),
};

import type { Meta, StoryObj } from "@storybook/vue3";

import { EvCard } from "../EvCard";
import { EvButtonProps } from "@/components";
import { ArrowContinueIcon, HelpIcon, ShieldIcon } from "@/icons";

const meta: Meta<typeof EvCard> = {
    component: EvCard,
    argTypes: {
        actions: {
            control: "object",
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
        default: {
            description:
                "The `default` slot may be used to render any content below the content and above the actions.",
        },
        disabled: {
            control: "boolean",
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
        iconAppearance: {
            control: "select",
            options: [
                undefined,
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
            options: ["a", "div", "button"],
            description: "You can change the HTML element for the component.",
        },
        text: {
            control: "text",
            description:
                "The text to show below the heading/title may be supplied as prop containing a string, an array of strings or " +
                "an array of `EvText` props. For greater control, use the `text` slot.",
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
        href: {
            control: "text",
            description:
                "Renders as an `<a>` link when an `href` is supplied and is not an empty string, " +
                "otherwise is rendered as a `<div>` unless otherwise stipulated in the `tag` prop.",
        },
        to: {
            control: "text",
            description:
                "Denotes the target route of the link. You can find more information about the \n" +
                "`to` prop on the <a href='https://router.vuejs.org/api/interfaces/RouterLinkProps.html#to' target='_blank'>vue-router documentation</a>.",
        },
        replace: {
            control: "boolean",
            description:
                "Setting replace prop will call `router.replace()` instead of `router.push()` when clicked, " +
                "so the navigation will not leave a history record. You can find more information about the `replace`\n" +
                " prop on the <a href='https://router.vuejs.org/api/interfaces/RouterLinkProps.html#replace' target='_blank'>vue-router documentation</a>.",
        },
        exact: {
            control: "boolean",
            description:
                "Exactly match the link. Without this, `/` will match every route. You can find more information about the \n" +
                "`exact` prop on the <a href='https://router.vuejs.org/api/interfaces/UseLinkReturn.html#isExactActive'>vue-router documentation</a>.",
        },
        justifyActions: {
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
    },
    args: {
        actions: undefined,
        justifyActions: undefined,
        appearance: "default",
        elevation: "panel",
        eyebrow: "Example",
        icon: undefined,
        iconAppearance: undefined,
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
                    text: "Link action",
                    variant: "link",
                },
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

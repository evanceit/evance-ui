import type { Meta, StoryObj } from "@storybook/vue3";

import { EvButton } from "../EvButton";
import { ArrowContinueIcon, CheckIcon, PlusIcon, SaveIcon } from "../../icons";

const meta: Meta<typeof EvButton> = {
    component: EvButton,
    argTypes: {
        default: {
            control: "text",
            description: "Label",
        },
        disabled: {
            control: "boolean",
        },
        href: {
            control: "text",
            description:
                "Renders as an `<a>` link when an `href` is supplied and is not an empty string, " +
                "otherwise is rendered as a `<button>`.",
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
            description: "Changes the appearance of the button.",
        },
        variant: {
            control: "select",
            options: ["default", "bold", "outlined", "subtle", "tonal", "link"],
            description: "Changes the appearance of the button.",
        },
        size: {
            control: "select",
            options: ["x-small", "small", "medium", "large", "x-large"],
            description:
                "Changes the size of the button, which may be either `small`, `medium`, or `large`.",
        },
        icon: {
            control: "boolean",
            description:
                "May be supplied as a prop or a slot." +
                "Places an icon before the content/text of the button when supplied as a String or as an SVG component/glyph. " +
                "May also be supplied as a boolean to indicate that the `text` or default slot should be rendered within an icon-like style. ",
        },
        iconStart: {
            control: "select",
            description:
                "Places an icon at the start of the button. The icon may be supplied as a String or as an SVG component/glyph. " +
                "May also be supplied as a slot (see `icon-start` slot)",
            options: ["None", "CheckIcon", "PlusIcon", "SaveIcon"],
            mapping: {
                None: null,
                CheckIcon: CheckIcon,
                PlusIcon: PlusIcon,
                SaveIcon: SaveIcon,
            },
        },
        iconEnd: {
            control: "select",
            description:
                "Places an icon at the end of the button. The icon may be supplied as a String or as an SVG component/glyph. " +
                "May also be supplied as a slot (see `icon-end` slot)",
            options: ["None", "ArrowContinueIcon"],
            mapping: {
                None: null,
                ArrowContinueIcon: ArrowContinueIcon,
            },
        },
        fullWidth: {
            control: "boolean",
        },
        loading: {
            control: "boolean",
            description:
                "Puts the button into a loading state, effectively disabling it.",
        },
        rounded: {
            control: "boolean",
        },
    },
    args: {
        appearance: "default",
        variant: "default",
        default: "Continue",
        disabled: false,
        href: undefined,
        icon: false,
        iconStart: "None",
        iconEnd: "None",
        size: "medium",
        fullWidth: false,
        loading: false,
        rounded: false,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvButton>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvButton },
        setup() {
            return { CheckIcon, ArrowContinueIcon, args };
        },
        template: '<ev-button v-bind="args">{{ args.default }}</ev-button>',
    }),
};

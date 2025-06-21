import type { Meta, StoryObj } from "@storybook/vue3";

import { EvButton } from "../EvButton";
import { ArrowContinueIcon, CheckIcon, PlusIcon, SaveIcon } from "../../icons";

const meta: Meta<typeof EvButton> = {
    component: EvButton,
    title: "Components/Actions/EvButton",
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
                "inverse",
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
        value: {
            description: "A button may have a value.",
        },
        selectedClass: {
            description: "The class applied when selected.",
        },
        selectedAppearance: {
            description: "The appearance to use when selected.",
        },
        selectedVariant: {
            description: "The appearance variant to use when selected.",
        },
        selectedIcon: {
            description: "The `icon` glyph to use when selected.",
        },
        selectedIconStart: {
            description: "The icon glyph to use as `icon-start` when selected",
        },
        selectedIconEnd: {
            description: "The icon glyph to use as `icon-end` when selected.",
        },
        additional: {
            description:
                "This slot may be used by parent components to inject additional content into the button. " +
                "For example, `EvTab` uses the additional slot to inject an absolutely positioned selection indicator.",
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

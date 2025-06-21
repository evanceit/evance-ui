import type { Meta, StoryObj } from "@storybook/vue3";

import { EvAvatar } from "../EvAvatar";
import { CheckIcon, CompanyIcon, EvanceIcon } from "@/icons";
import { EvIcon } from "@/components";
import { Appearance, Variant } from "@/util";

const meta: Meta<typeof EvAvatar> = {
    component: EvAvatar,
    title: "Components/Content/EvAvatar",
    argTypes: {
        appearance: {
            control: "select",
            options: Object.values(Appearance),
            description:
                "Appearance may be: `default`, `danger`, `information`, `notice`, `success`, or `warning`.",
        },
        variant: {
            control: "select",
            options: Object.values(Variant),
            description:
                "Whether to apply a solid background, giving the component a bolder appearance.",
        },
        icon: {
            control: "select",
            options: ["None", "EvanceIcon", "CheckIcon", "CompanyIcon"],
            mapping: {
                None: undefined,
                EvanceIcon: EvanceIcon,
                CheckIcon: CheckIcon,
                CompanyIcon: CompanyIcon,
            },
            description:
                "Render an imag using the `glyph` attribute for `<ev-icon>`.",
        },
        image: {
            control: "select",
            options: [
                "",
                "https://picsum.photos/id/11/600/600",
                "https://picsum.photos/id/12/600/600",
                "https://picsum.photos/id/13/600/600",
            ],
            description:
                "Render an image using the `src` attribute for `<ev-img>`.",
        },
        rounded: {
            control: "select",
            options: [
                0,
                "x-small",
                "small",
                "medium",
                "large",
                "x-large",
                "circle",
                "pill",
            ],
            description:
                "Designates the border-radius applied to the component.",
        },
        size: {
            control: "select",
            options: ["x-small", "small", "medium", "large", "x-large"],
            description:
                "Sets the height and width of the component. " +
                "Default unit is px. " +
                "Can also use the following predefined sizes: `x-small`, `small`, `medium` (default), `large`, and `x-large`.",
        },
        text: {
            control: "text",
            description: "Specify content text for the component.",
        },
        default: {
            control: "text",
            description:
                "The default slot may be used instead of text, or custom content.",
        },
    },
    args: {
        appearance: "default",
        variant: "default",
        icon: "None",
        size: undefined,
        image: undefined,
        text: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvAvatar>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvAvatar, EvIcon },
        setup() {
            return { EvIcon, EvanceIcon, args };
        },
        template: `<ev-avatar v-bind="args" />`,
    }),
};

import type { Meta, StoryObj } from "@storybook/vue3";

import { EvIcon, IconAppearance } from "../EvIcon";
import {
    EvanceCircleIcon,
    EvanceIcon,
    HelpIcon,
    MinusIcon,
    PlusIcon,
} from "@/icons";

const meta: Meta<typeof EvIcon> = {
    component: EvIcon,
    title: "Components/Content/EvIcon",
    argTypes: {
        appearance: {
            control: "select",
            options: Object.values(IconAppearance),
        },
        size: {
            control: "select",
            options: ["small", "medium", "large", "x-large"],
            description:
                "There are three icon sizes: `small` (16px), `medium` (24px), and `large` (32px). This pixel size refers to the canvas the icon sits on, not the size of the icon shape itself.",
        },
        glyph: {
            control: "select",
            description: "The SVG contents to display in the icon.",
            options: [
                "EvanceIcon",
                "EvanceCircleIcon",
                "HelpIcon",
                "MinusIcon",
                "PlusIcon",
            ],
            mapping: {
                EvanceIcon: EvanceIcon,
                EvanceCircleIcon: EvanceCircleIcon,
                HelpIcon: HelpIcon,
                MinusIcon: MinusIcon,
                PlusIcon: PlusIcon,
            },
        },
    },
    args: {
        glyph: "Evance",
    },
};

export default meta;

type Story = StoryObj<typeof EvIcon>;

export const Primary: Story = {
    render: (args) => ({
        components: { EvIcon },
        setup() {
            return { EvanceIcon, args };
        },
        template: `<ev-icon :glyph="EvanceIcon" v-bind="args" />`,
    }),
};

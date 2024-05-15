import type { Meta, StoryObj } from "@storybook/vue3";

import { EvLozenge } from "../EvLozenge";
import { Appearance, Variant } from "@/util";
import {Check, ChevronDown} from "@/icons";

const meta: Meta<typeof EvLozenge> = {
    component: EvLozenge,
    argTypes: {
        default: {
            control: "text",
            description: "Slot content",
        },
        appearance: {
            control: "select",
            options: Object.values(Appearance),
            description:
                "Appearance may be: `default`, `danger`, `information`, `notice`, `success`, or `warning`.",
        },
        maxWidth: {
            control: "text",
            description: "May also be supplied as `max-width`.",
        },
        variant: {
            control: "select",
            options: Object.values(Variant),
            description:
                "Whether to apply a solid background, giving the component a bolder appearance.",
        },
        iconStart: {
            control: "select",
            options: ["None", "Check"],
            mapping: {
                None: undefined,
                Check: Check,
            },
        },
        iconEnd: {
            control: "select",
            options: ["None", "ChevronDown"],
            mapping: {
                None: undefined,
                ChevronDown: ChevronDown,
            },
        },
    },
    args: {
        default: "Example",
        appearance: "default",
        variant: "default",
        iconStart: undefined,
        iconEnd: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvLozenge>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvLozenge },
        setup() {
            return { args };
        },
        template: '<ev-lozenge v-bind="args">{{ args.default }}</ev-lozenge>',
    }),
};

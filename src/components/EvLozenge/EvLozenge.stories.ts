import type { Meta, StoryObj } from "@storybook/vue3";

import { EvLozenge } from "../EvLozenge";
import { Appearance, Variant } from "@/util";
import { CheckIcon, ChevronDownIcon } from "@/icons";

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
            options: ["None", "CheckIcon"],
            mapping: {
                None: undefined,
                CheckIcon: CheckIcon,
            },
        },
        iconEnd: {
            control: "select",
            options: ["None", "ChevronDownIcon"],
            mapping: {
                None: undefined,
                ChevronDownIcon: ChevronDownIcon,
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

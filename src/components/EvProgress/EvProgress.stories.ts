import type { Meta, StoryObj } from "@storybook/vue3";

import { EvProgress } from "../EvProgress";
import { Appearance } from "../../util";

const meta: Meta<typeof EvProgress> = {
    component: EvProgress,
    argTypes: {
        appearance: {
            control: "select",
            options: Object.values(Appearance),
            description: "The `default` appearance inherits the current color.",
        },
        indeterminate: {
            control: "boolean",
            description:
                "Using the `indeterminate` prop causes the component to animate indefinitely.",
        },
        percentage: {
            if: {
                arg: "indeterminate",
                truthy: false,
            },
            control: {
                type: "range",
                min: 0,
                max: 100,
            },
            description:
                "Progress is shown as a percentage from 0 to 100. Percentage is ignored when `indeterminate` is set to `true`.",
        },
        size: {
            control: "select",
            options: ["small", "medium", "large", 24, 500],
            description:
                "The size of the progress bar relates to its height. Whilst the size accepts a numeric value (in pixels), " +
                "there are three predefined sizes that are typically used: `small`, `medium` (default) and `large`.",
        },
    },
    args: {
        appearance: Appearance.default,
        indeterminate: false,
        percentage: 0,
        size: "medium",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvProgress>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvProgress },
        setup() {
            return { args };
        },
        template: '<ev-progress v-bind="args"></ev-progress>',
    }),
};

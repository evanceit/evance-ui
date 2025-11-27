import type { Meta, StoryObj } from "@storybook/vue3";

import { EvButtonGroup } from "../EvButtonGroup";
import { EvButton } from "@/components";

const meta: Meta<typeof EvButtonGroup> = {
    component: EvButtonGroup,
    title: "Components/Actions/EvButtonGroup",
    argTypes: {
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
        },
        variant: {
            control: "select",
            options: ["default", "bold", "outlined", "subtle", "tonal", "link"],
        },
        gap: {
            control: "select",
            options: [
                "none",
                "auto",
                "x-small",
                "small",
                "medium",
                "large",
                "x-large",
            ],
        },
        grow: {
            control: "boolean",
        },
        size: {
            control: "select",
            options: ["x-small", "small", "medium", "large", "x-large"],
        },
        rounded: {
            control: "boolean",
        },
        items: {
            control: "object",
            description:
                "Accepts and array of `EvButtonProps` (see 'Items Prop' example below)",
        },
    },
    args: {
        appearance: "default",
        variant: "default",
        gap: "auto",
        grow: false,
        size: "medium",
        rounded: false,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvButtonGroup>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvButtonGroup, EvButton },
        setup() {
            return { args };
        },
        template: `
    <ev-button-group v-bind="args">
        <ev-button>Button 1</ev-button>
        <ev-button>Button 2</ev-button>
        <ev-button>Button 3</ev-button>
    </ev-button-group>`,
    }),
};

/**
 * Buttons may also be rendered using the `items` prop,
 * which accepts an array of `EvButtonProps`.
 *
 * ```html
 * <script>
 * const items = [
 *   {
 *      text: "Button 1"
 *   },
 *   {
 *      text: "Button 2"
 *   },
 *   {
 *      text: "Button 3"
 *   }
 * ];
 * </script>
 * <template>
 *     <ev-button-group :items="items" />
 * </template>
 * ```
 */
export const ItemsProp: Story = {
    render: (args: any) => ({
        components: { EvButtonGroup },
        setup() {
            const items = [
                {
                    text: "Button 1",
                },
                {
                    text: "Button 2",
                },
                {
                    text: "Button 3",
                },
            ];
            return { items };
        },
        template: `
        <ev-button-group :items="items" />
        `,
    }),
};

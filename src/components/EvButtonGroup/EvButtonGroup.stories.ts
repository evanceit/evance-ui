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
            description: "The default appearance of buttons within the group",
        },
        variant: {
            control: "select",
            options: ["default", "bold", "outlined", "subtle", "tonal", "link"],
            description:
                "The default appearance variant of buttons in the group",
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
                0,
                50,
                100,
                150,
                200,
            ],
            description:
                "Defines the gap between the buttons which can be a recognised size key, " +
                "a numeric spacer value e.g. 100, or breakpoint rules. Setting the gap to `auto` " +
                "chooses a gap appropriate to `size` prop. A value of `none` is the same as `0`.",
        },
        grow: {
            control: "boolean",
            description:
                "By default a button group renders inline - allowing it to be justified. " +
                "When grow is set to true, the button group will stretch to fill the available space, " +
                "and stretch the buttons to fill the group.",
        },
        size: {
            control: "select",
            options: ["x-small", "small", "medium", "large", "x-large"],
            description: "The default size of buttons in the group",
        },
        rounded: {
            control: "boolean",
            description:
                "Defaults all buttons in the goup to a rounded pill shape",
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

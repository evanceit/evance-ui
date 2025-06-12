import type { Meta, StoryObj } from "@storybook/vue3";

import { EvSwatch } from "../EvSwatch";

const meta: Meta<typeof EvSwatch> = {
    component: EvSwatch,
    argTypes: {
        size: {
            control: "select",
            options: [
                "undefined",
                "x-small",
                "small",
                "medium",
                "large",
                "x-large",
            ],
            mapping: {
                undefined: undefined,
            },
        },
        rounded: {
            control: "select",
            options: [
                "undefined",
                "x-small",
                "small",
                "medium",
                "large",
                "x-large",
                "circle",
            ],
            mapping: {
                undefined: undefined,
            },
        },
        value: {
            control: "select",
            options: [
                "undefined",
                "#FF0000",
                "#FF000066",
            ],
            mapping: {
                undefined: undefined,
            },
        },
    },
    args: {
        size: undefined,
        rounded: undefined,
        value: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvSwatch>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvSwatch },
        setup() {
            return { args };
        },
        template: `<ev-swatch v-bind="args" />`,
    }),
};

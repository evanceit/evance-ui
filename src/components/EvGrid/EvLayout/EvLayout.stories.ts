import type { Meta, StoryObj } from "@storybook/vue3";

import { EvBlock } from "../EvBlock";
import { EvLayout } from "../EvLayout";
import { EvSurface } from "../../EvSurface";

const meta: Meta<typeof EvLayout> = {
    component: EvLayout,
    title: "Components/Layout/EvLayout",
    argTypes: {
        align: {
            control: "select",
            options: [
                undefined,
                "start",
                "end",
                "center",
                "baseline",
                "stretch",
            ],
            description: "",
        },
        alignContent: {
            control: "select",
            options: [
                undefined,
                "start",
                "end",
                "center",
                "stretch",
                "space-between",
                "space-around",
                "space-evenly",
            ],
            description: "",
        },
        column: {
            control: "boolean",
            description:
                "The direction of a layout is 'row' by default. Making each `ev-block` within the layout " +
                "a column. However, setting the layout to a column means each `ev-block` could be considered a row.",
        },
        flow: {
            control: "select",
            options: ["horizontal", "vertical", "grid"],
            description: "",
        },
        gap: {
            control: "select",
            options: [
                undefined,
                0,
                25,
                50,
                75,
                100,
                150,
                200,
                250,
                300,
                400,
                500,
                600,
                800,
                1000,
                1200,
                1600,
                "x-small",
                "small",
                "medium",
                "large",
                "x-large",
                "{ xs: 100, md: 200, xl: 300 }",
            ],
            mapping: {
                "{ xs: 100, md: 200, xl: 300 }": { xs: 100, md: 200, xl: 300 },
            },
            description:
                "Control the horizontal and vertical space between children using the `gap` prop. " +
                "Accepts a numeric spacer value e.g. `100`, or breakpoint rules. " +
                "If your layout consists of blocks that need to wrap with consistent widths " +
                "(e.g. rows of 4 blocks), you should use a `grid` flow.",
        },
        gridColumns: {
            control: "select",
            options: [undefined, 1, 2, 3, 4, "{xs: 1, sm: 2, md: 3, lg: 4}"],
            mapping: {
                "{xs: 1, sm: 2, md: 3, lg: 4}": { xs: 1, sm: 2, md: 3, lg: 4 },
            },
            description: "",
        },
        justify: {
            control: "select",
            options: [
                undefined,
                "start",
                "end",
                "center",
                "space-between",
                "space-around",
                "space-evenly",
            ],
            description: "",
        },
        tag: {
            description: "",
        },
        height: {
            control: "select",
            options: [undefined, "auto", "300"],
            description:
                "Set an explicit height to the block. Behaves similar to `width`.",
        },
        width: {
            control: "select",
            options: [undefined, "25%", "50%", "100%"],
        },
        hidden: {
            control: "select",
            options: [
                undefined,
                true,
                false,
                "xs-only",
                "xs-only lg-up",
                "['xs-only', 'lg-up']",
                "{ xs: 'only', lg: 'up' }",
            ],
            mapping: {
                "['xs-only', 'lg-up']": ["xs-only", "lg-up"],
                "{ xs: 'only', lg: 'up' }": { xs: "only", lg: "up" },
            },
            description:
                "Accepts a boolean, string or a display rule list as an array or object. ",
        },
    },
    args: {
        align: undefined,
        alignContent: undefined,
        column: false,
        flow: "horizontal",
        gap: undefined,
        gridColumns: undefined,
        justify: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvBlock>;

export const Primary: Story = {
    render: (args: any) => ({
        components: { EvBlock, EvLayout, EvSurface },
        setup() {
            return { args };
        },
        template: `
            <ev-layout v-bind="args">
                <ev-block size="auto">
                    <ev-surface class="pa-100" elevation="overlay" style="height: 100%;">
                        Block #1
                    </ev-surface>
                </ev-block>
                <ev-block size="auto">
                    <ev-surface class="pa-100" elevation="overlay" style="height: 100%">
                        Block #2
                    </ev-surface>
                </ev-block>
                <ev-block size="auto">
                    <ev-surface class="pa-100" elevation="overlay" style="height: 100%">
                        Block #3
                    </ev-surface>
                </ev-block>
            </ev-layout>
        `,
    }),
};

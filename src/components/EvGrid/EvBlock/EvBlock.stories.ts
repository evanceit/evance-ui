import type { Meta, StoryObj } from "@storybook/vue3";

import { EvBlock } from "../EvBlock";
import { EvDivider, EvLayout } from "@/components";

const meta: Meta<typeof EvBlock> = {
    component: EvBlock,
    title: "Components/Layout/EvBlock",
    argTypes: {
        alignSelf: {
            control: "select",
            options: [
                "",
                "auto",
                "start",
                "end",
                "center",
                "baseline",
                "stretch",
                "{ xs: 'center', md: 'end', xl: 'start' }",
            ],
            mapping: {
                "": undefined,
                auto: "auto",
                start: "start",
                end: "end",
                center: "center",
                baseline: "baseline",
                stretch: "stretch",
                "{ xs: 'center', md: 'end', xl: 'start' }": {
                    xs: "center",
                    md: "end",
                    xl: "start",
                },
            },
            description:
                "Accepts `auto`, `start`, `end`, `center`, `baseline` or `stretch`. " +
                "Accepts a breakpoint object to apply responsive grid utility classes to the block. " +
                "For example, `{ xs: 'center' }`. ",
        },
        offset: {
            description:
                "Accepts a number from `1` to `12`. " +
                "Accepts a breakpoint object to apply responsive grid utility classes to the block. " +
                "For example, `{ xs: 1, lg: 2 }`. ",
        },
        order: {
            description:
                "Accepts a number from `1` to `12`. " +
                "Accepts a breakpoint object to apply responsive grid utility classes to the block. " +
                "For example, `{ xs: 1, lg: 2 }`. ",
        },
        scrollable: {
            control: "boolean",
            description:
                "Makes the block scrollable. Typically, this is most useful for column layouts.",
        },
        size: {
            control: "select",
            options: [
                "",
                "auto",
                "grow",
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                "{ xs: 1, md: 3, xl: 6 }",
            ],
            mapping: {
                "": undefined,
                auto: "auto",
                grow: "grow",
                1: 1,
                2: 2,
                3: 3,
                4: 4,
                5: 5,
                6: 6,
                7: 7,
                8: 8,
                9: 9,
                10: 10,
                11: 11,
                12: 12,
                "{ xs: 1, md: 3, xl: 6 }": { xs: 1, md: 3, xl: 6 },
            },
            description:
                "Accepts a `string`, `number` or a breakpoint object to apply responsive grid utility classes to the block. " +
                "The breakpoint object uses the breakpoint as the key (e.g. `xs`) and the block size as the value. " +
                "The block size may be `auto`, `grow` or a number from `1` to `12`. " +
                "For example, `{ xs: 12, md: 6}`. " +
                "Avoid using number based values when the block is within a column layout.",
        },
        tag: {
            description: "Sets the element tag for the block.",
        },
        width: {
            control: "select",
            options: [
                "",
                "auto",
                "20%",
                "200",
                "300px",
                "{ xs: 200, md: 400, xl: '100%' }",
            ],
            mapping: {
                "": undefined,
                auto: "auto",
                "20%": "20%",
                "200": 200,
                "300px": "300px",
                "{ xs: 200, md: 400, xl: '100%' }": {
                    xs: 200,
                    md: 400,
                    xl: "100%",
                },
            },
            description:
                "Set an explicit width to the block as an alternative to `size`. " +
                "Accepts a number - pixels are assumed as the units. " +
                "Accepts a string representing a number and units (e.g. `20%`), `auto` or `grow`. " +
                "These values are also accepted as values within a display rule object where the keys may be one of " +
                "`xs`, `sm`, `md`, `lg`, `xl`, `xxl` (breakpoints are the equivalent of `...Up` rules) " +
                "`xsOnly`, `smOnly`, `mdOnly`, `lgOnly`, `xlOnly`, `xxlOnly` " +
                "`smUp`, `mdUp`, `lgUp`, `xlUp`, " +
                "`smDown`, `mdDown`, `lgDown`, `xlDown`. " +
                "For example: `{ xs: 'auto', sm: '20%', mdUp: 300 }`.",
        },
        height: {
            description:
                "Set an explicit height to the block. Behaves similar to `width`.",
        },
        hidden: {
            control: "select",
            options: [
                "",
                "true",
                "false",
                "xs-only",
                "xs-only lg-up",
                "['xs-only', 'lg-up']",
                "{ xs: 'only', lg: 'up' }",
            ],
            mapping: {
                "": undefined,
                true: true,
                false: false,
                "xs-only": "xs-only",
                "xs-only lg-up": "xs-only lg-up",
                "['xs-only', 'lg-up']": ["xs-only", "lg-up"],
                "{ xs: 'only', lg: 'up' }": { xs: "only", lg: "up" },
            },
            description:
                "Accepts a boolean, string or a display rule list as an array or object. ",
        },
    },
    args: {
        alignSelf: undefined,
        scrollable: false,
        size: undefined,
        width: undefined,
        hidden: undefined,
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EvBlock>;

export const WithinADefaultLayout: Story = {
    render: (args: any) => ({
        components: { EvBlock, EvLayout },
        setup() {
            return { args };
        },
        template: `
            <ev-layout style="height: 300px;">
                <ev-block v-bind="args" style="background: var(--fill-neutral)">
                    <h3>Try me</h3>
                    <p>This block has a muted background colour to help visualise changes to the settings below.</p>
                    <p>Responsive settings will require you to resize your browser window to see their effect.</p>
                </ev-block>
            </ev-layout>
        `,
    }),
};

export const WithinAColumnLayout: Story = {
    render: (args: any) => ({
        components: { EvBlock, EvLayout, EvDivider },
        setup() {
            return { args };
        },
        template: `
            <ev-layout column style="height: 200px;">
                <ev-block size="auto">Contents</ev-block>
                <ev-divider />
                <ev-block scrollable>
                    <h3>Scrollable Area</h3>
                    <p>Scroll me</p>
                    <p>lorem ipsum</p>
                    <p>lorem ipsum</p>
                    <p>lorem ipsum</p>
                    <p>lorem ipsum</p>
                </ev-block>
                <ev-divider />
                <ev-block size="auto">Contents</ev-block>
            </ev-layout>
        `,
    }),
};

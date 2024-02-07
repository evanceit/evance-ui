import type {Meta, StoryObj} from "@storybook/vue3";

import { EvBlock } from "../EvBlock";
import {EvDivider, EvLayout} from "@/components";

const meta: Meta<typeof EvBlock> = {
    component: EvBlock,
    title: 'Components/EvGrid/EvBlock',
    argTypes: {
        alignSelf: {
            control: 'select',
            options: [
                'auto',
                'start',
                'end',
                'center',
                'baseline',
                'stretch'
            ],
            description: "Accepts `auto`, `start`, `end`, `center`, `baseline` or `stretch`. " +
                "Accepts a breakpoint object to apply responsive grid utility classes to the block. " +
                "For example, `{ xs: 'center' }`. "
        },
        offset: {
            description: "Accepts a number from `1` to `12`. " +
                "Accepts a breakpoint object to apply responsive grid utility classes to the block. " +
                "For example, `{ xs: 1, lg: 2 }`. "
        },
        order: {
            description: "Accepts a number from `1` to `12`. " +
                "Accepts a breakpoint object to apply responsive grid utility classes to the block. " +
                "For example, `{ xs: 1, lg: 2 }`. "
        },
        scrollable: {
            control: 'boolean',
            description: "Makes the block scrollable. Typically, this is most useful for column layouts."
        },
        size: {
            description: "Accepts a `string`, `number` or a breakpoint object to apply responsive grid utility classes to the block. " +
                "The breakpoint object uses the breakpoint as the key (e.g. `xs`) and the block size as the value. " +
                "The block size may be `auto`, `grow` or a number from `1` to `12`. " +
                "For example, `{ xs: 12, md: 6}`. " +
                "Avoid using number based values when the block is within a column layout."
        },
        tag: {
            description: "Sets the element tag for the block."
        },
        width: {
            description: "Set an explicit width to the block as an alternative to `size`. " +
                "Accepts a number - pixels are assumed as the units. " +
                "Accepts a string representing a number and units (e.g. `20%`), `auto` or `grow`. " +
                "These values are also accepted as values within a display rule object where the keys may be one of " +
                "`xs`, `sm`, `md`, `lg`, `xl`, `xxl`, " +
                "`smAndUp`, `mdAndUp`, `lgAndUp`, `xlAndUp`, " +
                "`smAndDown`, `mdAndDown`, `lgAndDown`, `xlAndDown`. " +
                "For example: `{ xs: 'auto', sm: '20%', mdAndUp: 300 }`."
        },
        height: {
            description: "Set an explicit height to the block. Behaves similar to `width`."
        },
        hidden: {
            description: "Accepts a boolean, string or a display rule list as an array. " +
                "For example, only visible on `sm` and `md` would look like: `:hidden=\"['xs', 'lgAndUp']\"`."
        }
    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvBlock>;

export const WithinADefaultLayout: Story = {
    render: (args: any) =>  ({
        components: { EvBlock, EvLayout },
        setup() {
            return { args };
        },
        template: `
            <ev-layout align="center" style="height: 200px;">
                <ev-block 
                    :size="{ xs: 'auto', md: 6 }"
                >
                    Contents 1
                </ev-block>
                <ev-block
                    :width="{
                        xs: 'auto',
                        smAndUp: '300',
                        mdAndUp: '30%',
                        lgAndUp: 'grow'
                    }"
                    :hidden="['xs']"
                >
                    Contents 2
                </ev-block>
                <ev-block>
                    Contents 3
                </ev-block>
            </ev-layout>
        `
    })
};

export const WithinAColumnLayout: Story = {
    render: (args: any) =>  ({
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
        `
    })
};
import type {Meta, StoryObj} from "@storybook/vue3";

import { EvBlock } from "../EvBlock";
import {EvDivider, EvLayout} from "@/components";

const meta: Meta<typeof EvBlock> = {
    component: EvBlock,
    title: 'Components/EvGrid/EvBlock',
    argTypes: {
        size: {
            description: "Accepts a `string`, `number` or a breakpoint object to apply responsive grid utility classes to the block. " +
                "The breakpoint object uses the breakpoint as the key (e.g. `xs`) and the block size as the value. " +
                "The block size may be `auto`, `grow` or a number from `1` to `12`. " +
                "For example, `{ xs: 12, md: 6}`. " +
                "Avoid using number based values when the block is within a column layout."
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
            <ev-layout style="height: 200px;">
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
                    :hidden="['md-and-down', 'xl-and-up']"
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
                <ev-block class="xs-auto">Contents</ev-block>
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
                <ev-block class="xs-auto">Contents</ev-block>
            </ev-layout>
        `
    })
};
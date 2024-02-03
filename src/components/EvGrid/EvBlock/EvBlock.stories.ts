import type {Meta, StoryObj} from "@storybook/vue3";

import { EvBlock } from "../EvBlock";
import {EvDivider, EvLayout} from "@/components";

const meta: Meta<typeof EvBlock> = {
    component: EvBlock,
    title: 'Components/EvGrid/EvBlock',
    argTypes: {

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
                    :size="{ xs: 12, md: 6 }"
                >
                    Contents 1
                </ev-block>
                <ev-block>
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
import type {Meta, StoryObj} from "@storybook/vue3";

import {EvWindow, EvWindowItem} from "../EvWindow";

const meta: Meta<typeof EvWindow> = {
    component: EvWindow,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvWindow>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvWindow, EvWindowItem },
        setup() {
            return { args };
        },
        template: `
            <ev-window v-bind="args" showArrows>
                <ev-window-item>Item 1</ev-window-item>
                <ev-window-item>Item 2</ev-window-item>
                <ev-window-item>Item 3</ev-window-item>
            </ev-window>
        `
    })
};
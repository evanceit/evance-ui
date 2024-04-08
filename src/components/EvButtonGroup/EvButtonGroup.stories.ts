import type {Meta, StoryObj} from "@storybook/vue3";

import { EvButtonGroup } from "../EvButtonGroup";
import {EvButton} from "@/components";

const meta: Meta<typeof EvButtonGroup> = {
    component: EvButtonGroup,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvButtonGroup>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvButtonGroup, EvButton },
        setup() {
            return { args };
        },
        template: `
    <ev-button-group v-bind="args">
        <ev-button>Button 1</ev-button>
        <ev-button>Button 2</ev-button>
        <ev-button>Button 3</ev-button>
    </ev-button-group>`
    })
};
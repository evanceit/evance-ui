import type {Meta, StoryObj} from "@storybook/vue3";

import { EvButtonToggle } from "../EvButtonToggle";
import {EvButton} from "@/components";

const meta: Meta<typeof EvButtonToggle> = {
    component: EvButtonToggle,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvButtonToggle>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvButtonToggle, EvButton },
        setup() {
            return { args };
        },
        template: `
    <ev-button-toggle v-bind="args">
        <ev-button>Button 1</ev-button>
        <ev-button>Button 2</ev-button>
        <ev-button>Button 3</ev-button>
    </ev-button-toggle>`
    })
};
import type {Meta, StoryObj} from "@storybook/vue3";

import { EvMenu } from "../EvMenu";
import { EvButton } from "../EvButton";

const meta: Meta<typeof EvMenu> = {
    component: EvMenu,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvMenu>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvMenu, EvButton },
        setup() {
            return { args };
        },
        template: '<ev-menu v-bind="args">' +
            '<template v-slot:activator="{ props }"><ev-button v-bind="props">Menu</ev-button></template>' +
            '</ev-menu>'
    })
};

export const ParentActivator: Story = {
    render: (args: any) =>  ({
        components: { EvMenu, EvButton },
        setup() {
            return { args };
        },
        template: '<ev-button v-bind="props">Menu' +
            '<ev-menu v-bind="args" activator="parent"></ev-menu>' +
            '</ev-button>'
    })
};
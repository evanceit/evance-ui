import type {Meta, StoryObj} from "@storybook/vue3";

import { EvDrawer } from "../EvDrawer";

const meta: Meta<typeof EvDrawer> = {
    component: EvDrawer,
    title: "Overlays/EvDrawer",
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvDrawer>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvDrawer },
        setup() {
            return { args };
        },
        template: `Hello`
    })
};
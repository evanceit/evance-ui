import type {Meta, StoryObj} from "@storybook/vue3";

import { EvButton } from "../EvButton";

const meta: Meta<typeof EvButton> = {
    component: EvButton,
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvButton>;

export const Primary: Story = {
    render: () =>  ({
        components: { EvButton },
        template: '<ev-button />'
    })
};
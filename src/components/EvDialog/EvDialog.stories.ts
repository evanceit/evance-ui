import type {Meta, StoryObj} from "@storybook/vue3";

import { EvDialog } from "../EvDialog";
import { EvButton } from "../EvButton";

const meta: Meta<typeof EvDialog> = {
    components: {EvButton},
    component: EvDialog,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvDialog>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvDialog, EvButton },
        setup() {
            return { args };
        },
        template: `
            <ev-dialog v-bind="args">
                <template #activator="{ isActive, props }">
                    <ev-button v-bind="props" :appearance="isActive ? 'primary' : 'default'">Open</ev-button>
                </template>
            </ev-dialog>
        `
    })
};
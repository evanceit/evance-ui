import type {Meta, StoryObj} from "@storybook/vue3";

import { EvList } from "../EvList";

const meta: Meta<typeof EvList> = {
    component: EvList,
    argTypes: {
        disabled: {
            control: 'boolean'
        }
    },
    args: {
        disabled: false
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvList>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvList },
        setup() {
            return { args };
        },
        template: '<ev-list v-bind="args"></ev-list>'
    })
};
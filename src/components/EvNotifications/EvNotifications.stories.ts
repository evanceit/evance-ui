import type {Meta, StoryObj} from "@storybook/vue3";
import { EvNotifications } from "../EvNotifications";


const meta: Meta<typeof EvNotifications> = {
    component: EvNotifications,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvNotifications>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvNotifications},
        setup() {
            return { args };
        },
        template: `
            <ev-notifications />
        `
    })
};
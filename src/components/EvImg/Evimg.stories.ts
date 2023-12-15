import type {Meta, StoryObj} from "@storybook/vue3";

import { EvImg } from "../EvImg";

const meta: Meta<typeof EvImg> = {
    component: EvImg,
    title: 'Components/EvImg',
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvImg>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvImg },
        setup() {
            return { args };
        },
        template: `<ev-img />`
    })
};
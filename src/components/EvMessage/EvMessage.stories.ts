import type {Meta, StoryObj} from "@storybook/vue3";

import { EvMessage } from "../EvMessage";
import {Appearance} from "../../util";

const meta: Meta<typeof EvMessage> = {
    component: EvMessage,
    argTypes: {
        appearance: {
            control: 'select',
            options: Object.values(Appearance)
        },
        default: {
            control: 'text'
        }
    },
    args: {
        appearance: Appearance.default,
        default: null
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvMessage>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvMessage },
        setup() {
            return { args };
        },
        template: '<ev-message v-bind="args"><p>{{ args.default }}</p></ev-message>'
    })
};
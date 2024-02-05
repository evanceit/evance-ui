import type {Meta, StoryObj} from "@storybook/vue3";

import { EvMessage } from "../EvMessage";
import { EvButton } from "../EvButton";
import {Appearance} from "@/util";
import {Reload} from "../../icons";


const meta: Meta<typeof EvMessage> = {
    component: EvMessage,
    argTypes: {
        appearance: {
            control: 'select',
            options: Object.values(Appearance)
        },
        closable: {
            control: 'boolean'
        },
        default: {
            control: 'text'
        },
        modelValue: {
            control: 'boolean'
        },
        title: {
            control: 'text'
        }
    },
    args: {
        appearance: Appearance.default,
        closable: true,
        default: 'Put your message content here',
        modelValue: true,
        title: 'Example message title'
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvMessage>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvMessage, EvButton},
        setup() {
            return { args, Reload };
        },
        template: `
            <ev-message v-bind="args"><p>{{ args.default }}</p></ev-message>
            <div v-if="!args.modelValue"><ev-button :icon="Reload" @click="args.modelValue = true">Reset</ev-button></div>`
    })
};
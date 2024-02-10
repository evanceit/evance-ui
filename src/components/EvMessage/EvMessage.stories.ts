import type {Meta, StoryObj} from "@storybook/vue3";

import { EvMessage } from "../EvMessage";
import {EvButton, EvButtonProps} from "../EvButton";
import {Appearance} from "@/util";
import {Reload} from "../../icons";
import {EvAvatar} from "@/components";


const meta: Meta<typeof EvMessage> = {
    component: EvMessage,
    argTypes: {
        appearance: {
            control: 'select',
            options: Object.values(Appearance)
        },
        expandable: {
            control: 'boolean'
        },
        dismissible: {
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
        },
        transparent: {
            control: 'boolean'
        }
    },
    args: {
        appearance: Appearance.default,
        dismissible: false,
        expandable: false,
        default: 'Put your message content here',
        modelValue: true,
        title: 'Example message title',
        transparent: false,
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvMessage>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvMessage, EvButton, EvAvatar},
        setup() {

            const actions: EvButtonProps[] = [
                {
                    text: 'My Action',
                    onClick: () => { console.log('foo'); }
                }
            ];

            return { args, Reload, actions };
        },
        template: `
            <ev-message v-bind="args" :actions="actions">
                <p>{{ args.default }}</p>
            </ev-message>
            
            <div v-if="!args.modelValue">
                <ev-button :icon="Reload" @click="args.modelValue = true">Reset</ev-button>
            </div>`
    })
};
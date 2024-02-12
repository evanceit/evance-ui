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
        variant: {
            control: 'select',
            options: ['subtle', 'tonal', 'bold']
        }
    },
    args: {
        appearance: Appearance.default,
        dismissible: false,
        expandable: false,
        default: 'Put your message content here',
        modelValue: true,
        title: 'Example message title',
        variant: 'tonal',
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
                    text: 'Primary Action',
                    appearance: 'default',
                    onClick: () => { console.log('Primary'); }
                },
                {
                    text: 'Secondary Action',
                    onClick: () => { console.log('Secondary'); }
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
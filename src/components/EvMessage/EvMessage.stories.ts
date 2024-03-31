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
            options: Object.values(Appearance),
            description: "Set the color appearance of the message. Use in conjunction with `variant` to modify the strength of the message."
        },
        expandable: {
            control: 'boolean',
            description: "Whether to hide the description and actions until the user expands the message."
        },
        description: {
            control: 'text',
            description: "Adds basic text below the title. Accepts HTML, but remember to sanitize first if you need to. " +
                "For more complicated content use the `default` slot."
        },
        dismissible: {
            control: 'boolean',
            description: "Whether the user can dismiss the message."
        },
        default: {
            control: 'text'
        },
        modelValue: {
            control: 'boolean',
            description: "Can be used to hide the message."
        },
        title: {
            control: 'text',
            description: "The `title` of the message is required."
        },
        variant: {
            control: 'select',
            options: ['subtle', 'tonal', 'bold'],
            description: "Adjust the strength of the `appearance`."
        }
    },
    args: {
        appearance: Appearance.default,
        description: undefined,
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
                    variant: 'bold',
                    onClick: () => { console.log('Primary'); }
                },
                {
                    text: 'Secondary Action',
                    variant: 'tonal',
                    onClick: () => { console.log('Secondary'); }
                },
                {
                    text: 'Tertiary Action',
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
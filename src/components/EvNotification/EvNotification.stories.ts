import type {Meta, StoryObj} from "@storybook/vue3";

import { EvNotification } from "../EvNotification";
import {Appearance} from "@/util";
import {Reload} from "../../icons";
import {EvButton} from "@/components";

const meta: Meta<typeof EvNotification> = {
    component: EvNotification,
    argTypes: {
        appearance: {
            control: 'select',
            options: Object.values(Appearance)
        }
    },
    args: {
        appearance: Appearance.default
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvNotification>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvNotification, EvButton, Reload},
        setup() {
            return { args };
        },
        template: `
            <ev-notification v-bind="args">
                <p>This is a message.</p>
            </ev-notification>
            
            <div v-if="!args.modelValue">
                <ev-button :icon="Reload" @click="args.modelValue = true">Reset</ev-button>
            </div>`
    })
};
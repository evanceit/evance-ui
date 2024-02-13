import type {Meta, StoryObj} from "@storybook/vue3";

import { EvTag } from "../EvTag";
import {EvButton} from "@/components";
import {Reload} from "../../icons";

const meta: Meta<typeof EvTag> = {
    component: EvTag,
    argTypes: {
        closable: {
            control: 'boolean'
        },
        disabled: {
            control: 'boolean'
        },
        modelValue: {
            control: 'boolean'
        },
        tag: {
            control: 'text',
            description: "Sets the HTML tag used for the component."
        },
        text: {
            control: 'text',
            description: "Sets the text inside the component."
        }
    },
    args: {
        closable: false,
        disabled: false,
        modelValue: true,
        tag: undefined,
        text: 'Example tag'
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvTag>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvTag, EvButton },
        setup() {
            const reset = () => {
                args['onUpdate:modelValue'](true);
            };
            return { args, Reload, reset };
        },
        template: `
            <ev-tag v-bind="args" />
            
            <ev-button v-if="!args.modelValue" text="Reset" :icon="Reload" @click="reset" />
        `
    })
};
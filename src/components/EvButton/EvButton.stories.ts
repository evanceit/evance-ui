import type {Meta, StoryObj} from "@storybook/vue3";

import { EvButton } from "../EvButton";
import {ArrowContinue, Check, Plus, Save} from "../../icons";
import {markRaw} from "vue";

const meta: Meta<typeof EvButton> = {
    component: EvButton,
    argTypes: {
        default: {
            control: 'text',
            description: 'Label'
        },
        disabled: {
            control: 'boolean'
        },
        href: {
            control: 'text',
            description: 'Renders as an `<a>` link when an `href` is supplied and is not an empty string, ' +
                'otherwise is rendered as a `<button>`.'
        },
        appearance: {
            control: 'select',
            options: ['default', 'danger', 'primary', 'subtle'],
            description: 'Changes the appearance of the button to either `default`, `danger`, `primary`, or `subtle`.'
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: 'Changes the size of the button, which may be either `small`, `medium`, or `large`.'
        },
        'icon-start': {
            control: 'select',
            description: "Places an icon before the button's text",
            options: ['None', 'Check', 'Plus', 'Save'],
            mapping: {
                'None': null,
                'Check': markRaw(Check),
                'Plus': markRaw(Plus),
                'Save': markRaw(Save)
            }
        },
        'icon-end': {
            control: 'select',
            description: "Places an icon after the button's text",
            options: ['None', 'ArrowContinue'],
            mapping: {
                'None': null,
                'ArrowContinue': markRaw(ArrowContinue)
            }
        },
        fullWidth: {
            control: 'boolean'
        },
        loading: {
            control: 'boolean',
            description: "Puts the button into a loading state, effectively disabling it."
        },
        rounded: {
            control: 'boolean'
        }
    },
    args: {
        appearance: 'default',
        default: 'Continue',
        disabled: false,
        href: null,
        'icon-start': 'None',
        'icon-end': 'None',
        size: 'medium',
        fullWidth: false,
        loading: false,
        rounded: false
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvButton>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvButton },
        setup() {
            return { Check, ArrowContinue, args };
        },
        template: '<ev-button v-bind="args">{{ args.default }}</ev-button>'
    })
};
import type {Meta, StoryObj} from "@storybook/vue3";

import { EvButton } from "../EvButton";
import {ArrowContinue, Check, Plus, Save} from "../../icons";

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
        icon: {
            control: 'boolean',
            description: "Places an icon before the content/text of the button when supplied as a String or as an SVG component/glyph. " +
                "May also be supplied as a boolean to indicate that the `text` or default slot should be rendered within an icon-like style."
        },
        iconStart: {
            control: 'select',
            description: "Places an icon at the start of the button. The icon may be supplied as a String or as an SVG component/glyph.",
            options: ['None', 'Check', 'Plus', 'Save'],
            mapping: {
                'None': null,
                'Check': Check,
                'Plus': Plus,
                'Save': Save
            }
        },
        iconEnd: {
            control: 'select',
            description: "Places an icon at the end of the button. The icon may be supplied as a String or as an SVG component/glyph.",
            options: ['None', 'ArrowContinue'],
            mapping: {
                'None': null,
                'ArrowContinue': ArrowContinue
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
        href: undefined,
        icon: false,
        iconStart: 'None',
        iconEnd: 'None',
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
import type {Meta, StoryObj} from "@storybook/vue3";

import { EvTextarea } from "../EvTextarea";
import {InputAppearance} from "../../util";

const meta: Meta<typeof EvTextarea> = {
    component: EvTextarea,
    argTypes: {
        appearance: {
            control: 'select',
            options: Object.values(InputAppearance)
        },
        autofocus: {
            control: 'boolean'
        },
        autogrow: {
            control: 'boolean'
        },
        disabled: {
            control: 'boolean'
        },
        clearable: {
            control: 'boolean'
        },
        loading: {
            control: 'boolean',
            description: "When `loading` is `true` a linear progress bar is added to the bottom of the textfield " +
                "in an indeterminate state. However, if an `icon` has been set, a circular progress progress bar " +
                "is used instead."
        },
        modelValue: {
            control: 'text',
            description: "The `model-value` is the `v-model` value of the component."
        },
        name: {
            control: 'text',
            description: "Sets the name attribute of the internal input."
        }
    },
    args: {
        appearance: InputAppearance.default,
        autofocus: false,
        autogrow: true,
        clearable: false,
        disabled: false,
        loading: false,
        modelValue: "A\nB\nC\nD\nE\nF\nG\nH"
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvTextarea>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvTextarea },
        setup() {
            return { args };
        },
        template: '<ev-textarea v-bind="args">foo</ev-textarea>'
    })
};
import type {Meta, StoryObj} from "@storybook/vue3";

import { EvDivider } from "../EvDivider";
import {Appearance} from "../../util";

const meta: Meta<typeof EvDivider> = {
    component: EvDivider,
    argTypes: {
        appearance: {
            control: 'select',
            options: Object.values(Appearance)
        },
        borderStyle: {
            control: 'select',
            options: ['solid', 'dashed', 'dotted']
        },
        opacity: {
            control: {
                type: 'range',
                min: 1,
                max: 100
            }
        },
        thickness: {
            control: {
                type: 'range',
                min: 1,
                max: 16
            }
        },
        vertical: {
            control: 'boolean'
        },
        default: {
            control: 'text'
        }
    },
    args: {
        appearance: 'default',
        borderStyle: 'solid',
        opacity: 20,
        vertical: false,
        default: null,
        thickness: 1
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvDivider>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvDivider },
        setup() {
            return { args };
        },
        template: '<div style="height: 200px; display: flex; align-items: center; justify-content: center">' +
            '<ev-divider v-bind="args">{{ args.default }}</ev-divider>' +
            '</div>'
    })
};
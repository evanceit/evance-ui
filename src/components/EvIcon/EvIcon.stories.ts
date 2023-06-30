import type {Meta, StoryObj} from "@storybook/vue3";

import { EvIcon } from "../EvIcon";
import {EvanceIcon, HelpIcon} from "../../icons";
import {markRaw} from "vue";

const meta: Meta<typeof EvIcon> = {
    component: EvIcon,
    argTypes: {
        size: {
            control: {
                type: 'select',
            },
            options: ['small', 'medium', 'large'],
            description: "There are three icon sizes: `small` (16px), `medium` (24px), and `large` (32px). This pixel size refers to the canvas the icon sits on, not the size of the icon shape itself."
        },
        glyph: {
            control: {
                type: 'select'
            },
            description: 'The SVG contents to display in the icon.',
            options: ['EvanceIcon', 'HelpIcon'],
            mapping: {
                'EvanceIcon': markRaw(EvanceIcon),
                'HelpIcon': markRaw(HelpIcon)
            },
            value: 'EvanceIcon'
        }
    },
    args: {
        glyph: 'EvanceIcon'
    }
};

export default meta;

type Story = StoryObj<typeof EvIcon>;

export const Primary: Story = {
    render: (args) =>  ({
        components: { EvIcon },
        setup() {
            return { EvanceIcon, args };
        },
        template: '<ev-icon :glyph="EvanceIcon" v-bind="args" />'
    }),
};
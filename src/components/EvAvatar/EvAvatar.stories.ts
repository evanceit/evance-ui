import type {Meta, StoryObj} from "@storybook/vue3";

import { EvAvatar } from "../EvAvatar";
import {Check, Company, Evance} from "@/icons";
import {EvIcon} from "@/components";

const meta: Meta<typeof EvAvatar> = {
    component: EvAvatar,
    argTypes: {
        appearance: {
            control: 'select',
            options: ['default', 'critical', 'information', 'notice', 'success', 'warning']
        },
        bold: {
            control: 'boolean'
        },
        icon: {
            control: 'select',
            options: ['None', 'Evance', 'Check', 'Company'],
            mapping: {
                'None': undefined,
                'Evance': Evance,
                'Check': Check,
                'Company': Company
            }
        },
        image: {
            control: 'select',
            options: [
                '',
                'https://picsum.photos/id/11/600/600',
                'https://picsum.photos/id/12/600/600',
                'https://picsum.photos/id/13/600/600'
            ]
        },
        rounded: {
            control: 'select',
            options: [0, 'x-small', 'small', 'medium', 'large', 'x-large', 'circle', 'pill']
        },
        size: {
            control: 'select',
            options: ['x-small', 'small', 'medium', 'large', 'x-large']
        },
        default: {
            control: 'text'
        }
    },
    args: {
        appearance: undefined,
        bold: false,
        icon: 'None',
        size: undefined,
        image: undefined
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvAvatar>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvAvatar, EvIcon },
        setup() {
            return { EvIcon, Evance, args };
        },
        template: `<ev-avatar v-bind="args">{{ args.default }}</ev-avatar>`
    })
};
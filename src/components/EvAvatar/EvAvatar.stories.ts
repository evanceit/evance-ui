import type {Meta, StoryObj} from "@storybook/vue3";

import { EvAvatar } from "../EvAvatar";
import {Cancel, Check, Evance} from "@/icons";
import {EvIcon} from "@/components";

const meta: Meta<typeof EvAvatar> = {
    component: EvAvatar,
    argTypes: {
        appearance: {
            control: 'select',
            options: ['default', 'critical', 'information', 'notice', 'success', 'warning']
        }
    },
    args: {
        appearance: undefined
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
        template: `<ev-avatar v-bind="args" />`
    })
};
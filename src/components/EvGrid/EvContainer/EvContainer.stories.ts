import type {Meta, StoryObj} from "@storybook/vue3";

import { EvBlock } from "../EvBlock";
import {EvLayout} from "../EvLayout";
import {EvSurface} from "../../EvSurface";
import {EvContainer} from "../EvContainer";

const meta: Meta<typeof EvContainer> = {
    component: EvContainer,
    title: 'Components/EvGrid/EvContainer',
    argTypes: {
        fluid: {
            control: 'boolean'
        },
        fill: {
            control: 'boolean'
        },
        tag: {
            description: ""
        },
        height: {
            control: 'select',
            options: ['', 'auto', '300'],
            description: "Set an explicit height to the block. Behaves similar to `width`."
        },
        width: {
            control: 'select',
            options: ['', '25%', '50%', '100%']
        },
        hidden: {
            control: 'select',
            options: [
                '',
                'true',
                'false',
                'xs-only',
                'xs-only lg-up',
                "['xs-only', 'lg-up']",
                "{ xs: 'only', lg: 'up' }"
            ],
            mapping: {
                '': undefined,
                'true': true,
                'false': false,
                'xs-only': 'xs-only',
                'xs-only lg-up': 'xs-only lg-up',
                "['xs-only', 'lg-up']" : ['xs-only', 'lg-up'],
                "{ xs: 'only', lg: 'up' }": { xs: 'only', lg: 'up' }
            },
            description: "Accepts a boolean, string or a display rule list as an array or object. "
        }
    },
    args: {
        fluid: false,
        fill: false,
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvBlock>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvBlock, EvLayout, EvSurface, EvContainer },
        setup() {
            return { args };
        },
        template: `
            <ev-container v-bind="args">
                <ev-layout column>
                    <ev-block size="auto">
                        <ev-surface class="pa-100" elevation="overlay" style="height: 100%;">
                            Block #1 (auto)
                        </ev-surface>
                    </ev-block>
                    <ev-block>
                        <ev-surface class="pa-100" elevation="overlay" style="height: 100%">
                            Block #2 (grow)
                        </ev-surface>
                    </ev-block>
                    <ev-block size="auto">
                        <ev-surface class="pa-100" elevation="overlay" style="height: 100%">
                            Block #3 (auto)
                        </ev-surface>
                    </ev-block>
                </ev-layout>
            </ev-container>
        `
    })
};
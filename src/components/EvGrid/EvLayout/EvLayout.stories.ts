import type {Meta, StoryObj} from "@storybook/vue3";

import { EvBlock } from "../EvBlock";
import {EvLayout} from "../EvLayout";
import {EvSurface} from "../../EvSurface";

const meta: Meta<typeof EvLayout> = {
    component: EvLayout,
    title: 'Components/EvGrid/EvLayout',
    argTypes: {
        align: {
            control: 'select',
            options: [
                '', 'start', 'end', 'center', 'baseline', 'stretch'
            ],
            mapping: {
                '': undefined,
                'start': 'start',
                'end': 'end',
                'center': 'center',
                'baseline': 'baseline',
                'stretch': 'stretch'
            },
            description: ""
        },
        alignContent: {
            control: 'select',
            options: [
                '', 'start', 'end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly'
            ],
            mapping: {
                '': undefined,
                'start': 'start',
                'end': 'end',
                'center': 'center',
                'stretch': 'stretch',
                'space-between': 'space-between',
                'space-around': 'space-around',
                'space-evenly': 'space-evenly'
            },
            description: ""
        },
        column: {
            control: 'boolean',
            description: "The direction of a layout is 'row' by default. Making each `ev-block` within the layout " +
                "a column. However, setting the layout to a column means each `ev-block` could be considered a row."
        },
        gutter: {
            control: 'select',
            options: [
                '',
                0, 25, 50, 75, 100, 150, 200, 300, 400, 600, 800,
                "{ xs: 100, md: 200, xl: 300 }"
            ],
            mapping: {
                '': undefined,
                0: 0,
                25: 25,
                50: 50,
                75: 75,
                100: 100,
                150: 150,
                200: 200,
                300: 300,
                400: 400,
                600: 600,
                800: 800,
                "{ xs: 100, md: 200, xl: 300 }": { xs: 100, md: 200, xl: 300 }
            },
            description: ""
        },
        justify: {
            control: 'select',
            options: [
                '', 'start', 'end', 'center', 'space-between', 'space-around', 'space-evenly'
            ],
            mapping: {
                '': undefined,
                'start': 'start',
                'end': 'end',
                'center': 'center',
                'space-between': 'space-between',
                'space-around': 'space-around',
                'space-evenly': 'space-evenly'
            },
            description: ""
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
        align: undefined,
        alignContent: undefined,
        column: false,
        gutter: undefined,
        justify: undefined,
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvBlock>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvBlock, EvLayout, EvSurface },
        setup() {
            return { args };
        },
        template: `
            <ev-layout v-bind="args">
                <ev-block size="auto">
                    <ev-surface class="pa-100" elevation="overlay" style="height: 100%;">
                        Block #1
                    </ev-surface>
                </ev-block>
                <ev-block size="auto">
                    <ev-surface class="pa-100" elevation="overlay" style="height: 100%">
                        Block #2
                    </ev-surface>
                </ev-block>
                <ev-block size="auto">
                    <ev-surface class="pa-100" elevation="overlay" style="height: 100%">
                        Block #3
                    </ev-surface>
                </ev-block>
            </ev-layout>
        `
    })
};
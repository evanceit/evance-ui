import type {Meta, StoryObj} from "@storybook/vue3";

import { EvBlock } from "../EvBlock";
import {EvLayout} from "../EvLayout";
import {EvSurface} from "../../EvSurface";

const meta: Meta<typeof EvBlock> = {
    component: EvBlock,
    title: 'Components/EvGrid/EvLayout',
    argTypes: {
        align: {
            control: 'select',
            options: [
                '', 'start', 'end', 'center', 'baseline', 'stretch'
            ]
        },
        alignContent: {
            control: 'select',
            options: [
                '', 'start', 'end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly'
            ]
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
            }
        },
        justify: {
            control: 'select',
            options: [
                '', 'start', 'end', 'center', 'space-between', 'space-around', 'space-evenly'
            ]
        }
    },
    args: {
        align: undefined,
        alignContent: undefined,
        gutter: undefined
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
            <ev-layout v-bind="args" style="height: 300px;">
                <ev-block size="3">
                    <ev-surface elevation="panel" style="height: 100%">
                        Column #1
                    </ev-surface>
                </ev-block>
                <ev-block size="3">
                    <ev-surface elevation="panel" style="height: 100%">
                        Column #2
                    </ev-surface>
                </ev-block>
                <ev-block size="3">
                    <ev-surface elevation="panel" style="height: 100%">
                        Column #3
                    </ev-surface>
                </ev-block>
            </ev-layout>
        `
    })
};
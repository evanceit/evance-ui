import type {Meta, StoryObj} from "@storybook/vue3";

import { EvImg } from "../EvImg";
import {EvProgressCircular} from "@/components";

const meta: Meta<typeof EvImg> = {
    component: EvImg,
    title: 'Components/EvImg',
    argTypes: {
        cover: {
            control: 'boolean'
        },
        src: {
            control: 'select',
            options: [
                'https://picsum.photos/id/11/1600/900',
                'https://picsum.photos/id/12/1600/900',
                'https://bad.src/not/valid'
            ]
        }
    },
    args: {
        cover: false,
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvImg>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvImg, EvProgressCircular },
        setup() {
            return { args };
        },
        template: `
            <ev-img
                v-bind="args"
            >
                <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                        <ev-progress-circular
                            color="grey-lighten-4"
                            indeterminate
                        ></ev-progress-circular>
                    </div>
                </template>
            </ev-img>`
    })
};
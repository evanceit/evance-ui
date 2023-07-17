import type {Meta, StoryObj} from "@storybook/vue3";

import { EvList } from "../EvList";
import {ref} from "vue";

const meta: Meta<typeof EvList> = {
    component: EvList,
    argTypes: {
        disabled: {
            control: 'boolean'
        }
    },
    args: {
        disabled: false
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvList>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvList },
        methods: {
            onClickSelect(e) {
                console.log(e);
            }
        },
        setup() {

            const items =  [
                {
                    title: 'Example 1',
                    value: 1
                },
                {
                    title: 'Example 2',
                    value: 2
                },
                {
                    title: 'Example 3',
                    value: 3
                }
            ];

            let selected = ref([]);

            return { args, items, selected };
        },
        template: '<ev-list :items="items" v-model:selected="selected" @click:select="onClickSelect"></ev-list> {{ selected }}'
    })
};
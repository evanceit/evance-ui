import type {Meta, StoryObj} from "@storybook/vue3";

import ExampleDialog from "./ExampleDialog.vue";
import {EvButton} from "@/components";
import {useDialog} from "@/composables/dialog.ts";

const meta: Meta = {
    title: 'EvDialogService',
    argTypes: {

    },
    args: {
    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
    render: (args) =>  ({
        components: { EvButton, ExampleDialog },
        setup() {

            const dialog = useDialog();

            function open() {
                dialog.open({
                    slots: {
                        default: ExampleDialog
                    }
                });
            }

            return { args, open };
        },
        template: `<ev-button @click="open">Click me</ev-button>`
    }),
};
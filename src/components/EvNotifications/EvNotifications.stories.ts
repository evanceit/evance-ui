import type {Meta, StoryObj} from "@storybook/vue3";
import {EvNotificationOptions, EvNotifications, useNotification} from "../EvNotifications";
import {EvButton} from "@/components";
import {ArrowContinue, Minus, Plus} from "../../icons";
import {randomArrayItem} from "@/util";

const meta: Meta<typeof EvNotifications> = {
    component: EvNotifications,
    argTypes: {

    },
    args: {

    },
    tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof EvNotifications>;

export const Primary: Story = {
    render: (args: any) =>  ({
        components: { EvNotifications, EvButton},
        setup() {

            const notification = useNotification();

            const appearances = ['default', 'critical', 'success', 'warning', 'notice', 'information'];
            const variants = ['subtle', 'tonal', 'bold'];

            function addItem() {
                const options: EvNotificationOptions = {
                    props: {
                        title: `Wow a new notification`,
                        appearance: randomArrayItem(appearances),
                        variant: randomArrayItem(variants),
                        timeout: 3000,
                        description: "This will self-dismiss in <strong>3 seconds</strong>.",
                        actions: [
                            {
                                text: 'Say Goodbye',
                                iconEnd: ArrowContinue,
                                onClick() {
                                    dismiss()
                                },
                            }
                        ]
                    }
                };
                const {dismiss} = notification.add(options);
            }

            return { args, Plus, Minus, addItem };
        },
        template: `
            
            <p>Create a random Notfication</p>
            <ev-button @click="addItem" :icon-start="Plus">Add item</ev-button>
            
            <ev-notifications />
        `
    })
};
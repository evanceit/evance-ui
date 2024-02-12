import type {Meta, StoryObj} from "@storybook/vue3";
import {EvNotifications} from "../EvNotifications";
import {EvNotificationProps} from "@/components/EvNotification";
import {EvButton} from "@/components";
import {ArrowContinue, Minus, Plus} from "../../icons";
import {randomArrayItem} from "@/util";
import {useNotification} from "@/composables/notification.ts";

const meta: Meta<typeof EvNotifications> = {
    component: EvNotifications,
    title: 'Overlays/EvNotifications'
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
                const props: EvNotificationProps = {
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
                };
                const {dismiss} = notification.add(props);
            }

            return { args, Plus, Minus, addItem };
        },
        template: `
            
            <ev-notifications />
            
            <p>Create a random Notfication</p>
            <ev-button @click="addItem" :icon-start="Plus">Add item</ev-button>
        `
    })
};

export const Saved: Story = {
    render: (args: any) =>  ({
        components: { EvNotifications, EvButton},
        setup() {

            const notification = useNotification();

            function save() {
                const props: EvNotificationProps = {
                    title: `Saved!`,
                    appearance: 'success',
                    actions: [
                        {
                            text: "Thanks",
                            onClick: () => {
                                dismiss();
                            }
                        }
                    ]
                };
                const {dismiss} = notification.add(props);
            }

            return { args, save };
        },
        template: `
            <ev-notifications />
            <ev-button @click="save">Save</ev-button>
        `
    })
};
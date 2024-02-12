import {h, mergeProps, ref, shallowRef, VNode, VNodeProps, watch} from "vue";
import {EvNotificationOptions, Notification} from "./EvNotifications.ts";
import {EvNotificationSlots} from "@/components";

/**
 * # EvNotificationsManager
 */
export class EvNotificationsManager {

    public readonly notifications = ref<Notification[]>([]);
    private num = 0;

    /**
     * ## add
     *
     * @param options
     */
    public add(options: EvNotificationOptions) {
        const id = ++this.num;
        const props = this.createProps(id, options);
        const slots = this.createSlots(options);
        this.notifications.value.unshift({ id, props, slots });
        return {
            id,
            dismiss: () => {
                this.dismiss(id);
            }
        }
    }

    /**
     * ## createProps
     *
     * @param id
     * @param options
     * @private
     */
    private createProps(id: number, options: EvNotificationOptions) {
        const model = options.props?.modelValue ?? shallowRef(true);
        watch(model, () => {
            this.dismiss(id);
        });
        return mergeProps(
            options.props as VNodeProps,
            {
                modelValue: model
            }
        );
    }

    /**
     * ## createSlots
     *
     * @param options
     * @private
     */
    private createSlots(options: EvNotificationOptions) {
        const internalSlots = options.slots ?? {};
        const renderedSlots: { [key: string]: (props: any, slots: any) => VNode } = {};
        for (const key in internalSlots) {
            const component = internalSlots[key as keyof EvNotificationSlots];
            renderedSlots[key] = (props, slots) => {
                return h(component!, props, slots);
            };
        }
        return renderedSlots;
    }

    /**
     * # Dismiss
     *
     * @param id
     */
    public dismiss(id: number) {
        const index = this.notifications.value.findIndex(notification => notification.id === id);
        this.notifications.value.splice(index, 1);
    }
}
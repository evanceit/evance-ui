import {h, isRef, ref, shallowRef, VNode, VNodeProps, watch} from "vue";
import {Notification} from "./EvNotifications.ts";
import {EvNotificationProps, EvNotificationSlots} from "@/components";

/**
 * # EvNotificationsManager
 */
export class EvNotificationsManager {

    public readonly notifications = ref<Notification[]>([]);
    private num = 0;

    /**
     * ## add
     *
     * @param props
     * @param slots
     */
    public add(props: EvNotificationProps, slots?: EvNotificationSlots) {
        const id = ++this.num;
        const renderedProps = this.createProps(id, props);
        const renderedSlots = this.createSlots(slots);
        this.notifications.value.unshift({
            id,
            props: renderedProps as object,
            slots: renderedSlots as object
        });
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
     * @param props
     * @private
     */
    private createProps(id: number, props: EvNotificationProps) {
        const model = isRef(props.modelValue) ? props.modelValue : shallowRef(true);
        watch(model, () => {
            this.dismiss(id);
        });
        return Object.assign(
            props as VNodeProps,
            {
                modelValue: model
            }
        );
    }

    /**
     * ## createSlots
     *
     * @private
     * @param slots
     */
    private createSlots(slots?: EvNotificationSlots) {
        const internalSlots = slots ?? {};
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
     * # dismiss
     *
     * @param id
     */
    public dismiss(id: number) {
        const index = this.notifications.value.findIndex(notification => notification.id === id);
        this.notifications.value.splice(index, 1);
    }
}
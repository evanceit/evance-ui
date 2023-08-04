import {DirectiveBinding} from "vue/dist/vue";
import {VNode} from "vue";

export const slotsDirective = {
    beforeMount(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
        const slots = binding.value || {};

        console.log(slots);

        const subComponentVNode = vnode.componentInstance;
        if (!subComponentVNode) {
            return;
        }

        Object.keys(slots).forEach((slotName) => {
            subComponentVNode.$slots[slotName] = slots[slotName];
        });

        // Clear the original slots to prevent them from being rendered in the parent component
        //vnode.data.scopedSlots = {};
    }
};

export default slotsDirective;
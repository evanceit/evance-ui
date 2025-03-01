import { DirectiveBinding } from "vue";
import { VNode } from "vue";

export const SlotsDirective = {
    beforeMount(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
        const slots = binding.value || {};

        const subComponentVNode = vnode.component;
        if (!subComponentVNode) {
            return;
        }

        Object.keys(slots).forEach((slotName) => {
            subComponentVNode.slots[slotName] = slots[slotName];
        });
    },
};

export default SlotsDirective;

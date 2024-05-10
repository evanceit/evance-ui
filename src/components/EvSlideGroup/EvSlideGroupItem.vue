<script setup lang="ts">
import {
    GroupItemProps,
    GroupItemProvide,
    makeGroupItemProps,
    useGroupItem,
} from "@/composables/groupItem.ts";
import { computed, UnwrapRef } from "vue";
import { EvSlideGroupSymbol } from "@/components";

type EvSlideGroupItemSlots = {
    default: {
        isSelected: UnwrapRef<GroupItemProvide["isSelected"]>;
        select: GroupItemProvide["select"];
        toggle: GroupItemProvide["toggle"];
        selectedClass: UnwrapRef<GroupItemProvide["selectedClass"]>;
    };
};

defineEmits(["group:selected"]);

defineSlots<EvSlideGroupItemSlots>();

const props = defineProps({
    ...makeGroupItemProps(),
});
const slideGroupItem = useGroupItem(
    props as any as GroupItemProps,
    EvSlideGroupSymbol,
);
const slotProps = computed(() => {
    return {
        isSelected: slideGroupItem!.isSelected.value,
        select: slideGroupItem!.select,
        toggle: slideGroupItem!.toggle,
        selectedClass: slideGroupItem!.selectedClass.value,
    };
});
</script>

<template>
    <slot v-bind="slotProps" />
</template>

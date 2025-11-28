<script setup lang="ts">
import "./EvButtonSelect.scss";
import {
    EvButtonSelectSlots,
    EvButtonSelectSymbol,
    makeEvButtonSelectProps,
} from "./EvButtonSelect";
import { EvButtonGroup } from "../EvButtonGroup";
import { GroupProps, useGroup } from "@/composables/group";
import { filterComponentProps } from "@/util";
import { computed } from "vue";

const props = defineProps({
    ...makeEvButtonSelectProps(),
});

defineEmits(["update:modelValue"]);

defineSlots<EvButtonSelectSlots>();

const { isSelected, next, previous, select, selected } = useGroup(
    props as any as GroupProps,
    EvButtonSelectSymbol,
);

defineExpose({
    next,
    previous,
    select,
});

const groupProps = computed(() => filterComponentProps(EvButtonGroup, props));
const slotProps = { isSelected, next, previous, select, selected };
</script>

<template>
    <ev-button-group
        :class="['ev-button-toggle', props.class]"
        :style="props.style"
        v-bind="groupProps">
        <slot v-bind="slotProps" />
    </ev-button-group>
</template>

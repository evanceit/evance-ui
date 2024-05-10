<script setup lang="ts">
/**
 * # EvButtonToggle
 */
import "./EvButtonToggle.scss";
import {
    EvButtonToggleSlots,
    EvButtonToggleSymbol,
    makeEvButtonToggleProps,
} from "./EvButtonToggle.ts";
import { EvButtonGroup } from "../EvButtonGroup";
import { GroupProps, useGroup } from "@/composables/group.ts";
import { filterComponentProps } from "@/util";
import { computed } from "vue";

const props = defineProps(makeEvButtonToggleProps());

defineEmits(["update:modelValue"]);

defineSlots<EvButtonToggleSlots>();

const { isSelected, next, previous, select, selected } = useGroup(
    props as any as GroupProps,
    EvButtonToggleSymbol,
);

defineExpose({
    next,
    previous,
    select,
});

const groupProps = computed(() => filterComponentProps(EvButtonGroup, props));
</script>

<template>
    <ev-button-group
        :class="['ev-button-toggle', props.class]"
        :style="props.style"
        v-bind="groupProps">
        <slot v-bind="{ isSelected, next, previous, select, selected }" />
    </ev-button-group>
</template>

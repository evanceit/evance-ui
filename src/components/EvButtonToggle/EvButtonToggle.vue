<script setup lang="ts">
/**
 * # EvButtonToggle
 */
import './EvButtonToggle.scss';
import {
    EvButtonToggleSlots,
    EvButtonToggleSymbol,
    makeEvButtonToggleProps
} from "@/components/EvButtonToggle/EvButtonToggle.ts";
import {EvButtonGroup} from "../EvButtonGroup";
import {GroupProps, useGroup} from "@/composables/group.ts";
import {filterComponentProps} from "@/util";

const props = defineProps(makeEvButtonToggleProps());

defineEmits([
    'update:modelValue'
]);

defineSlots<EvButtonToggleSlots>();

const { isSelected, next, prev, select, selected } = useGroup(props as any, EvButtonToggleSymbol);

defineExpose({
    next,
    prev,
    select
});

const groupProps = filterComponentProps(EvButtonGroup, props);

</script>
<template>
    <ev-button-group
        :class="[
            'ev-button-toggle',
            props.class
        ]"
        :style="props.style"
        v-bind="groupProps"
    >
        <slot v-bind="{isSelected, next, prev, select, selected}" />
    </ev-button-group>
</template>
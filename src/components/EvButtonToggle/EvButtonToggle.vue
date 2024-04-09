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
import {computed} from "vue";

const props = defineProps(makeEvButtonToggleProps());

defineEmits([
    'update:modelValue'
]);

defineSlots<EvButtonToggleSlots>();

const { isSelected, next, prev, select, selected } = useGroup(props as any as GroupProps, EvButtonToggleSymbol);

defineExpose({
    next,
    prev,
    select
});

const groupProps = computed(() => filterComponentProps(EvButtonGroup, props));

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
<script setup lang="ts">

import {EvDialog} from "@/components/EvDialog";
import {makeEvDrawerProps} from "@/components/EvDrawer/EvDrawer.ts";
import {computed, useSlots} from "vue";
import {filterComponentProps, omit} from "@/util";
import {useModelProxy} from "@/composables/modelProxy.ts";
import slots from "@/directives/slots.ts";

const props = defineProps(makeEvDrawerProps());
const slotsDefined = useSlots();
const dialogProps = computed(() => {
    return omit(
        filterComponentProps(EvDialog, props),
        ['position']
    )
});
const isActive = useModelProxy(props, 'modelValue');
const vSlots = slots;

</script>
<template>
    <ev-dialog
        :class="[
            'ev-drawer',
            props.class
        ]"
        :style="props.style"
        v-bind="dialogProps"
        v-model="isActive"
        v-slots="slotsDefined"
    >
    </ev-dialog>
</template>
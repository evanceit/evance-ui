<script setup lang="ts">

import './EvRadioGroup.scss';
import {EvLabel, makeEvRadioGroupProps} from "@/components";
import {computed, useSlots} from "vue";
import {getNextId} from "@/util";
import {useModelProxy} from "@/composables/modelProxy.ts";

defineOptions({
    inheritAttrs: false
});

// Props & slots
const props = defineProps(makeEvRadioGroupProps());
const slots = useSlots();

// Emit
const emit = defineEmits([
    'update:modelValue'
]);

const uid = getNextId();
const id = computed(() => {
    return props.id || `radio-group-${uid}`;
});
const model = useModelProxy(props, "modelValue");

</script>
<template>
    <div
        :class="[
            'ev-radio-group',
            props.class
        ]"
        :style="props.style"
        :id="id"
    >

        <div class="ev-radio-group--label" v-if="props.label || slots.label">
            <ev-label>
                <slot name="label">{{ props.label }}</slot>
            </ev-label>
        </div>

        <div class="ev-radio-group--control">
            <slot />
        </div>

    </div>
</template>
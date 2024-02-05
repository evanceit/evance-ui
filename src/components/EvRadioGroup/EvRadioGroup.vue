<script setup lang="ts">

import './EvRadioGroup.scss';
import EvLabel from "@/components/EvLabel/EvLabel.vue";
import {EvRadioGroupSymbol, makeEvRadioGroupProps} from "./EvRadioGroup.ts";
import {computed, provide, useSlots} from "vue";
import {getNextId} from "@/util";
import {useFormField} from "@/composables/validation.ts";
import EvErrors from "@/components/EvErrors/EvErrors.vue";

defineOptions({
    inheritAttrs: false
});

// Props & slots
const props = defineProps(makeEvRadioGroupProps());
const slots = useSlots();

// Emit
defineEmits([
    'update:modelValue'
]);

const uid = getNextId();
const id = computed(() => {
    return props.id || `radio-group-${uid}`;
});

const formField = useFormField(props);
provide(EvRadioGroupSymbol, formField);

</script>
<template>
    <div
        :class="[
            'ev-radio-group',
            props.class,
            {
                'is-inline': props.inline
            }
        ]"
        :style="props.style"
        :id="id"
    >

        <div class="ev-radio-group--label" v-if="props.label || slots.label">
            <ev-label>
                <slot name="label">{{ props.label }}</slot>
            </ev-label>

            <div class="ev-radio-group-errors" v-if="formField.isShowErrorMessages">
                <ev-errors :messages="formField.errorMessages" />
            </div>
        </div>

        <div class="ev-radio-group--control">
            <slot />
        </div>

    </div>
</template>
<script setup lang="ts">
import "./EvRadioGroup.scss";
import EvLabel from "@/components/EvLabel/EvLabel.vue";
import { EvRadioGroupSymbol, makeEvRadioGroupProps } from "./EvRadioGroup.ts";
import { computed, provide, useSlots } from "vue";
import { getNextId } from "@/util";
import { useFormField } from "@/composables/validation.ts";
import EvErrors from "@/components/EvErrors/EvErrors.vue";

defineOptions({
    inheritAttrs: false,
});

// Props & slots
const props = defineProps({
    ...makeEvRadioGroupProps(),
});
const slots = useSlots();

// Emit
defineEmits(["update:modelValue"]);

const uid = getNextId();
const id = computed(() => {
    return props.id || `radio-group-${uid}`;
});

const formField = useFormField(props);
provide(EvRadioGroupSymbol, formField);
</script>

<template>
    <div
        :id="id"
        :class="[
            'ev-radio-group',
            props.class,
            {
                'is-inline': props.inline,
            },
        ]"
        :style="props.style">
        <div v-if="props.label || slots.label" class="ev-radio-group--label">
            <ev-label>
                <slot name="label">{{ props.label }}</slot>
            </ev-label>

            <div
                v-if="formField.isShowErrorMessages"
                class="ev-radio-group-errors">
                <ev-errors :messages="formField.errorMessages" />
            </div>
        </div>

        <div class="ev-radio-group--control">
            <slot />
        </div>
    </div>
</template>

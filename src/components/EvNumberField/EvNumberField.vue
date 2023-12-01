<script setup lang="ts">
/**
 * `<ev-number-field>`
 *
 * @todo: we need the following:
 * - decimalsMin
 * - decimalsMax
 */
import './EvNumberField.scss';
import {makeEvNumberFieldProps} from "./EvNumberField.ts";
import {EvTextfield} from "@/components/EvTextfield";
import {computed, onMounted, onUnmounted, Ref, ref, shallowRef, useSlots, watch} from "vue";
import {filterComponentProps, isEmpty, omit} from "@/util";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {EvButton} from "@/components/EvButton";
import {Minus, Plus} from "@/icons";

const props = defineProps(makeEvNumberFieldProps());
const slots = useSlots();

// EvTextfield
const evTextfieldRef = ref<EvTextfield>();
const evTextfieldProps = computed(() => {
    return omit(filterComponentProps(EvTextfield, props), ['modelValue']);
});

/**
 * We separate the `modelValue` and the `inputValue` (the value displayed)
 * because this allows us some efficiency improvements when holding down +/- buttons
 * as well as permitting formatting.
 *
 * Whenever the `modelValue` changes we need to ensure the `inputValue` is updated.
 */
const modelValue = useModelProxy(props, 'modelValue');
const inputValue: Ref<number | null | undefined> = shallowRef(modelValue.value);
watch(modelValue, () => {
    inputValue.value = modelValue.value;
});

const incrementAmount = computed(() => {
    return props.step ?? 1;
});
let incrementInterval: ReturnType<typeof setInterval> | null = null;
let incrementRate: number = 100;
const incrementDelay = 0.25;
let isIncrementing = false;

/**
 * # On Blur
 * We can only reliably enforce min/max boundaries entered during input
 * when the field is burred and not on input.
 */
function updateModelValue() {
    setValue(inputValue, inputValue.value);
}

/**
 * ## Is Max Boundary
 * @param value
 */
function isMaxBoundary(value: number | null | undefined): boolean {
    return (!isEmpty(props.max) && value! > props.max);
}

/**
 * ## Is Min Boundary
 * @param value
 */
function isMinBoundary(value: number | null | undefined): boolean {
    return (!isEmpty(props.min) && value! < props.min);
}

/**
 * ## Set Value
 * Can be used to set the value of either the 'modelValue' or the 'inputValue'.
 * @param model
 * @param value
 */
function setValue(model: Ref, value: number | null | undefined) {
    if (isEmpty(value)) {
        model.value = value;
    } else if (isMinBoundary(value)) {
        model.value = props.min;
    } else if (isMaxBoundary(value)) {
        model.value = props.max;
    } else {
        model.value = value;
    }
}

/**
 * ## Start Incrementing
 *
 * If the user holds the plus/minus button down for longer than the `incrementDelay`
 * we increase/decrease the `inputValue` by the `incrementAmount` at an increasing
 * rate for every second the user holds the button.
 *
 * @param direction
 */
function startIncrementing(direction: number) {
    if (isIncrementing) {
        return;
    }
    isIncrementing = true;
    if (isEmpty(inputValue.value)) {
        inputValue.value = 0;
    }

    // Do an initial increment
    setValue(inputValue, inputValue.value!  + (direction * incrementAmount.value));

    // Then we rely on the delay to do more increments on a timer
    let startTime = Date.now();
    let internalIncrementAmount = incrementAmount.value;
    incrementInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000;
        if (elapsedTime < incrementDelay) {
            return;
        }
        const multiplier = Math.floor(Math.pow(2, elapsedTime - 1));
        internalIncrementAmount = (incrementAmount.value * multiplier);
        setValue(inputValue, inputValue.value!  + (direction * internalIncrementAmount));
    }, incrementRate);
}

/**
 * ## Stop Incrementing
 *
 * When the user releases the plus/minus button stop the increment interval
 * and set the resulting value onto the `modelValue` - this is more efficient
 * than setting the `modelValue` with every increment.
 */
function stopIncrementing() {
    if (isIncrementing) {
        clearInterval(incrementInterval);
        setValue(modelValue, inputValue.value);
        isIncrementing = false;
    }
}

function documentMouseup() {
    stopIncrementing();
}

onMounted(() => {
    document.addEventListener('mouseup', documentMouseup, {
        passive: true
    });
});

onUnmounted(() => {
    document.removeEventListener('mouseup', documentMouseup);
})


</script>
<template>
    <ev-textfield
        ref="evTextfieldRef"
        class="ev-number-field"
        v-bind="evTextfieldProps"
        v-model="inputValue"
        type="number"
        @input="updateModelValue()"
        @blur="updateModelValue()"
        @keydown.up.prevent="startIncrementing(1)"
        @keyup.up.prevent="stopIncrementing()"
        @keydown.down.prevent="startIncrementing(-1)"
        @keyup.down.prevent="stopIncrementing()"
    >
        <template #label v-if="props.label || slots.label">
            <slot name="label">{{ props.label }}</slot>
        </template>
        <template #prefix>
            <ev-button
                rounded
                size="small"
                class="ev-number-field--minus"
                appearance="subtle"
                :icon="Minus"
                @mousedown="startIncrementing(-1)"
                @mouseup="stopIncrementing()"
            />
        </template>
        <template #suffix>
            <ev-button
                rounded
                size="small"
                class="ev-number-field--plus"
                appearance="subtle"
                :icon="Plus"
                @mousedown="startIncrementing(1)"
                @mouseup="stopIncrementing()"
            />
        </template>
    </ev-textfield>
</template>
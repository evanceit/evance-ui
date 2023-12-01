<script setup lang="ts">
/**
 * `<ev-number-field>`
 */
import './EvNumberField.scss';
import {makeEvNumberFieldProps} from "./EvNumberField.ts";
import {EvTextfield} from "@/components/EvTextfield";
import {computed, Ref, ref, shallowRef, useSlots, watch} from "vue";
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

const modelValue = useModelProxy(props, 'modelValue');
const inputValue: Ref<number | null | undefined> = shallowRef(modelValue.value);

watch(modelValue, () => {
    inputValue.value = modelValue.value;
});

const incrementAmount = computed(() => {
    return props.increment ?? 1;
});
let incrementInterval: ReturnType<typeof setInterval> | null = null;
let incrementRate: number = 100;
const incrementDelay = 0.5;

/**
 * @todo: we need the following:
 * - decimalsMin
 * - decimalsMax
 */

/**
 * # On Blur
 * We can only reliably enforce min/max boundaries entered during input
 * when the field is burred and not on input.
 */
function updateModelValue() {
    setValue(inputValue, inputValue.value);
}

/**
 * ## On Click Minus
 */
function onClickMinus() {
    setValue(modelValue, modelValue.value - incrementAmount.value);
}

/**
 * On Click Plus
 */
function onClickPlus() {
    setValue(modelValue, modelValue.value + incrementAmount.value);
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
    if (isEmpty(inputValue.value)) {
        inputValue.value = 0;
    }
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
 *
 * @param e
 */
function stopIncrementing(e: Event) {
    if (!isEmpty(incrementInterval)) {
        clearInterval(incrementInterval);
        setValue(modelValue, inputValue.value);
        e.stopPropagation();
    }
}



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
    >
        <template #prefix>
            <ev-button
                rounded
                size="small"
                class="ev-number-field--minus"
                appearance="subtle"
                :icon="Minus"
                @click="onClickMinus()"
                @mousedown="startIncrementing(-1)"
                @mouseup="stopIncrementing($event)"
            />
        </template>
        <template #label v-if="props.label || slots.label">
            <slot name="label">{{ props.label }}</slot>
        </template>
        <template #suffix>
            <ev-button
                rounded
                size="small"
                class="ev-number-field--plus"
                appearance="subtle"
                :icon="Plus"
                @click="onClickPlus()"
                @mousedown="startIncrementing(1)"
                @mouseup="stopIncrementing($event)"
            />
        </template>
    </ev-textfield>
</template>
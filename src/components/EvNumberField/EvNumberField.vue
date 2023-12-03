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
import {useLocaleManager} from "@/composables/locale.ts";

const localeManager = useLocaleManager()
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

/**
 * Minimum Boundary
 * The computed value is now only a number or null (undefined will be converted to null).
 */
const minimum = computed(() => {
    return props.min ?? null;
});

/**
 * Maximum Boundary
 * The computed value is now only a number or null (undefined will be converted to null).
 */
const maximum = computed(() => {
    return props.max ?? null;
});

/**
 * Incremental Values
 */
const incrementAmount = computed(() => {
    return props.step ?? 1;
});
let incrementInterval: ReturnType<typeof setInterval> | null = null;
let incrementRate: number = 100;
const incrementDelay = 0.25;
let isIncrementing = false;

/**
 * ## Is Max Boundary
 * @param value
 */
function isMaxBoundary(value: number): boolean {
    return (maximum.value !== null && maximum.value < value);
}

/**
 * ## Is Min Boundary
 * @param value
 */
function isMinBoundary(value: number): boolean {
    return (minimum.value !== null && minimum.value > value);
}

/**
 * # On Blur
 *
 * If the user has typed something we can't be sure that it is accurate
 * based upon the min/max boundaries so we reset the `inputValue` first.
 * Then, we can update the `modelValue` based on the input.
 */
function onBlur() {
    inputValue.value = getValue(inputValue.value);
    modelValue.value = inputValue.value;
}

/**
 * ## Get Number Formatter Options
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters
 * Do we want to be able to support the following?:
 * - currency
 * - currencyDisplay
 *
 * @todo: add some of these as props
 */
function getNumberFormatterOptions(overrides = {}) {
    const defaultOptions = {
        localeMatcher: 'best fit',
        style: 'decimal',
        useGrouping: true,
        minimumFractionDigits: props.decimalPlacesMin ?? 0,
        maximumFractionDigits: props.decimalPlacesMax ?? 6
    };
    return {...defaultOptions, ...overrides};
}

/**
 * ## Get Decimal Places
 * Returns the number of decimal places of the `value` supplied.
 * @param value
 */
function getDecimalPlaces(value: number): number {
    const options = getNumberFormatterOptions({
        useGrouping: false,
        minimumFractionDigits: 0,
        maximumFractionDigits: 20
    });
    const fraction = localeManager.numberFormatter
        .formatter(options)
        .formatToParts(value)
        .find(part => part.type === 'fraction');
    return fraction ? fraction.value.length : 0;
}

/**
 * ## Set Value
 * Can be used to set the value of either the 'modelValue' or the 'inputValue'.
 * @param value
 */
function getValue(value: number | null | undefined) {
    if (isEmpty(value)) {
        return value;
    }
    if (isMinBoundary(value!)) {
        value = minimum.value;
    } else if (isMaxBoundary(value!)) {
        value = maximum.value;
    }

    // We always want to constrain the value to the minimum
    // and maximum decimal places
    const decimalPlaces = getDecimalPlaces(value!);
    if (!isEmpty(props.decimalPlacesMin) && decimalPlaces < props.decimalPlacesMin!) {
        value = parseFloat(value!.toFixed(props.decimalPlacesMin));
    }
    if (!isEmpty(props.decimalPlacesMax) && decimalPlaces > props.decimalPlacesMax!) {
        value = parseFloat(value!.toFixed(props.decimalPlacesMax));
    }
    return value;
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
        inputValue.value = minimum.value ?? 0;
    } else {
        inputValue.value = getValue(inputValue.value!  + (direction * incrementAmount.value));
    }

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
        inputValue.value = getValue(inputValue.value!  + (direction * internalIncrementAmount));
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
        clearInterval(incrementInterval!);
        modelValue.value = getValue(inputValue.value);
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
        @blur="onBlur()"
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
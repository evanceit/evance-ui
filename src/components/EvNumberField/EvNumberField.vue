<script setup lang="ts">
/**
 * `<ev-number-field>`
 */
import './EvNumberField.scss';
import {makeEvNumberFieldProps, NumberParser} from "./EvNumberField.ts";
import {EvTextfield} from "@/components/EvTextfield";
import {computed, nextTick, Ref, ref, shallowRef, useSlots, watch} from "vue";
import {filterComponentProps, isEmpty, omit} from "@/util";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {EvButton} from "@/components/EvButton";
import {Minus, Plus} from "@/icons";
import {useLocaleManager} from "@/composables/locale.ts";
import {KeyboardEvent} from "react";

const localeManager = useLocaleManager()
const props = defineProps(makeEvNumberFieldProps());
const slots = useSlots();

// EvTextfield
const evTextfieldRef = ref<typeof EvTextfield>();
const evTextfieldProps = computed(() => {
    return omit(filterComponentProps(EvTextfield, props), ['modelValue']);
});

let numberParser = new NumberParser(localeManager, props);

/**
 * We separate the `modelValue` and the `inputValue` (the value displayed)
 * because this allows us some efficiency improvements when holding down +/- buttons
 * as well as permitting formatting.
 *
 * Whenever the `modelValue` changes we need to ensure the `inputValue` is updated.
 */
const modelValue = useModelProxy(props, 'modelValue');

const inputValue: Ref<string | null | undefined> = shallowRef();
inputValue.value = numberParser.formatValue(modelValue.value);
watch(modelValue, () => {
    inputValue.value = numberParser.formatValue(modelValue.value);
});

watch([
    localeManager.currentLocale,
    () => props.locale,
    () => props.localeMatcher,
    () => props.mode,
    () => props.currency,
    () => props.currencyDisplay,
    () => props.useGrouping,
    () => props.minFractionDigits,
    () => props.maxFractionDigits
], (value, oldValue) => {
    if (value !== oldValue) {
        inputValue.value = numberParser.formatValue(modelValue.value);
    }
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

/*
const currencySymbol = computed(() => {
    return numberParser.prefixChar;
});

 */

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
 * ## Get Decimal Places
 * Returns the number of decimal places of the `value` supplied.
 * @param value
 */
function getDecimalPlaces(value: number): number {
    const options = {
        useGrouping: false,
        minimumFractionDigits: 0,
        maximumFractionDigits: 20
    };
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
function getValue(value?: string | number | null) {
    if (isEmpty(value)) {
        return value ??  null;
    }
    if (typeof value === 'string') {
        value = parseFloat(value);
    }
    if (isMinBoundary(value!)) {
        value = minimum.value;
    } else if (isMaxBoundary(value!)) {
        value = maximum.value;
    }

    // We always want to constrain the value to the minimum
    // and maximum decimal places
    const decimalPlaces = getDecimalPlaces(value!);
    if (!isEmpty(props.minFractionDigits) && decimalPlaces < props.minFractionDigits!) {
        value = parseFloat(value!.toFixed(props.minFractionDigits));
    }
    if (!isEmpty(props.maxFractionDigits) && decimalPlaces > props.maxFractionDigits!) {
        value = parseFloat(value!.toFixed(props.maxFractionDigits));
    }
    return value;
}

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
function onBlur(e: Event) {
    if (inputValue.value === '-') {
        inputValue.value = '';
    }
    const parsedValue = numberParser.parseValue(inputValue.value as string);
    const currentValue = getValue(parsedValue);
    inputValue.value = numberParser.formatValue(currentValue);
    modelValue.value = numberParser.parseValue(inputValue.value);
}

/**
 * ## On Focus
 *
 * @param e
 */
function onFocus(e: Event) {
    if (props.readonly) {
        return;
    }
    inputValue.value = isEmpty(modelValue.value) ? '' : modelValue.value.toString();
}

/**
 * ## On Input Keydown
 * @param e
 */
function onInputKeydown(e: KeyboardEvent) {
    const passThrough = [
        'Backspace',
        'Delete',
        'Home',
        'End',
        'ArrowLeft',
        'ArrowRight',
        'Tab'
    ];
    if (passThrough.includes(e.key)) {
        return;
    }

    // Listen to ArrowUp
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        startIncrementing(1);
        return;
    }
    // Listen to ArrowDown
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        startIncrementing(-1);
        return;
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        const parsedValue = numberParser.parseValue(inputValue.value);
        const currentValue = getValue(parsedValue);
        modelValue.value = currentValue;
        nextTick(() => {
            inputValue.value = isEmpty(currentValue) ? '' : currentValue!.toString();
        });
        return;
    }

    const isPaste = (e.key === 'v' && e.ctrlKey);

    // Block anything not in the whitelist
    const whitelist = new RegExp('[0-9 +\-\/\(\)*]');
    if (!whitelist.test(e.key) && !isPaste) {
        e.preventDefault();
    }
}


/**
 * ## On Input Keyup
 * @param e
 */
function onInputKeyup(e: KeyboardEvent) {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
    }
    stopIncrementing();
}

/**
 * ## On Paste
 */
function onPaste(e: ClipboardEvent) {
    e.preventDefault();
    let data = e.clipboardData?.getData('Text');
    if (data) {
        const parsedValue = numberParser.parseValue(data);
        const currentValue = getValue(parsedValue);
        inputValue.value = isEmpty(currentValue) ? '' : currentValue!.toString();
        modelValue.value = currentValue;
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
    if (isIncrementing || props.readonly) {
        return;
    }
    isIncrementing = true;
    let currentValue: number;
    if (isEmpty(modelValue.value)) {
        currentValue = minimum.value ?? 0;
    } else {
        currentValue = getValue(modelValue.value!  + (direction * incrementAmount.value))! as number;
    }
    inputValue.value = numberParser.formatValue(currentValue);

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
        currentValue = getValue(currentValue  + (direction * internalIncrementAmount))! as number;
        inputValue.value = numberParser.formatValue(currentValue);
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
        const parsedValue = numberParser.parseValue(inputValue.value);
        modelValue.value = getValue(parsedValue);
        isIncrementing = false;
    }
}


</script>
<template>
    <ev-textfield
        ref="evTextfieldRef"
        class="ev-number-field"
        v-bind="evTextfieldProps"
        v-model="inputValue"
        type="text"
        @paste="onPaste"
        @blur="onBlur"
        @focus="onFocus"
        @keydown="onInputKeydown"
        @keyup="onInputKeyup"
    >
        <template #label v-if="props.label || slots.label">
            <slot name="label">{{ props.label }}</slot>
        </template>
        <template #prefix>
            <ev-button
                v-if="props.showButtons"
                rounded
                size="small"
                class="ev-number-field--minus"
                appearance="subtle"
                :icon="Minus"
                :disabled="props.readonly || props.disabled"
                @keydown.space.enter="startIncrementing(-1)"
                @keyup="stopIncrementing()"
                @mousedown="startIncrementing(-1)"
                @mouseup="stopIncrementing()"
                @mouseleave="stopIncrementing()"
            />
            <slot name="prefix">{{ props.prefix }}</slot>
        </template>
        <template #suffix>
            <slot name="suffix">{{ props.suffix }}</slot>
            <ev-button
                v-if="props.showButtons"
                rounded
                size="small"
                class="ev-number-field--plus"
                appearance="subtle"
                :icon="Plus"
                :disabled="props.readonly || props.disabled"
                @keydown.space.enter="startIncrementing(1)"
                @keyup="stopIncrementing()"
                @mousedown="startIncrementing(1)"
                @mouseup="stopIncrementing()"
                @mouseleave="stopIncrementing()"
            />
        </template>
    </ev-textfield>
</template>
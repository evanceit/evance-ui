<script setup lang="ts">
/**
 * # `<ev-checkbox>`
 */
import "./EvCheckbox.scss";
import { makeEvCheckboxProps, useToggleControl } from "./EvCheckbox.ts";
import { ref, useAttrs } from "vue";
import { splitInputAttrs } from "@/util";
import { EvErrors } from "@/components/EvErrors";
import { EvLabel } from "@/components/EvLabel";
import { useFormField } from "@/composables/validation.ts";
import { useDefaults } from "@/composables";

/**
 * We want to pass attributes not defined as 'props'
 * to the `<input>` field, so we need to turn off `inheritAttrs`.
 */
defineOptions({
    inheritAttrs: false,
});

// Props & slots
const definedProps = defineProps({
    ...makeEvCheckboxProps(),
});
const props = useDefaults(definedProps);
const slots = defineSlots<{
    label(): never;
}>();

// Emit
defineEmits(["update:focused", "update:modelValue"]);

const attrs = useAttrs();
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const [containerAttrs, inputAttrs] = splitInputAttrs(attrs);
const formField = useFormField(props);
const { trueValue, isChecked } = useToggleControl(formField.model, props);

/**
 * ## Get Input Element
 */
function getInputElement(): HTMLInputElement | null {
    return inputRef.value;
}

/**
 * ## On Input
 * @param e
 */
function onInput(e: Event) {
    isChecked.value = (e.target as HTMLInputElement).checked;
}

/**
 * ## Expose stuff
 */
defineExpose({
    input: inputRef,
    focus: () => {
        getInputElement()?.focus();
    },
    ...formField.expose(),
});
</script>

<template>
    <div
        ref="containerRef"
        :class="[
            'ev-checkbox',
            {
                'is-checked': isChecked,
                'is-labelled': props.label || slots.label,
            },
            formField.classes,
            props.class,
        ]"
        :style="props.style"
        v-bind="containerAttrs">
        <div class="ev-checkbox--control">
            <div class="ev-checkbox--boxes">
                <div class="ev-checkbox--outer-box"></div>
                <div class="ev-checkbox--inner-box">
                    <svg
                        class="ev-checkbox--checkmark"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            class="ev-checkbox--checkmark-path"
                            d="M3 7.5L6.5 11L13.5 4"
                            stroke="currentColor"
                            stroke-width="2" />
                    </svg>
                </div>
            </div>

            <input
                :id="formField.id"
                ref="inputRef"
                type="checkbox"
                role="switch"
                :name="formField.name"
                :disabled="formField.isDisabled"
                :readonly="formField.isReadonly"
                :checked="isChecked"
                :value="trueValue"
                :aria-disabled="formField.isDisabled"
                :aria-checked="isChecked"
                v-bind="inputAttrs"
                @input="onInput"
                @focus="formField.focus"
                @blur="formField.blur" />
        </div>

        <div
            v-if="props.label || props.hint || slots.label"
            class="ev-checkbox--label">
            <ev-label
                clickable
                :for="formField.id"
                :title="props.label"
                :hint="props.hint">
                <slot name="label" />
            </ev-label>

            <div
                v-if="formField.isShowErrorMessages"
                class="ev-checkbox--errors">
                <ev-errors :messages="formField.errorMessages" />
            </div>
        </div>
    </div>
</template>

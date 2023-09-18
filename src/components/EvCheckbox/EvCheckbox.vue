<script setup lang="ts">
/**
 * # `<ev-checkbox>`
 */
import './EvCheckbox.scss';
import {ref, useAttrs, useSlots} from "vue";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {splitInputAttrs} from "@/util";
import {useFocus} from "@/composables/focus.ts";
import {makeEvCheckboxProps, useToggleControl, EvLabel} from "@/components";
import {useFormField} from "@/composables/validation.ts";

/**
 * We want to pass attributes not defined as 'props'
 * to the `<input>` field, so we need to turn off `inheritAttrs`.
 */
defineOptions({
    inheritAttrs: false
});

// Props & slots
const props = defineProps(makeEvCheckboxProps());
const slots = useSlots();

// Emit
const emit = defineEmits([
    'update:focused',
    'update:modelValue'
]);

const attrs = useAttrs();
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const modelProxy = useModelProxy(props, 'modelValue');
const [ containerAttrs, inputAttrs ] = splitInputAttrs(attrs);
const { focusClasses, focus, blur } = useFocus(props);
const formField = useFormField(modelProxy, props);
const { trueValue, isChecked} = useToggleControl(modelProxy, props);

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
  ...formField.expose()
});

</script>
<template>
    <div ref="containerRef"
         :class="[
            'ev-checkbox',
            {
                'is-checked': isChecked,
                'is-labelled': props.label || slots.label
            },
            formField.classes,
            focusClasses,
            props.class
        ]"
         :style="props.style"
         v-bind="containerAttrs"
    >
        <div class="ev-checkbox--control">

            <div class="ev-checkbox--boxes">
                <div class="ev-checkbox--outer-box"></div>
                <div class="ev-checkbox--inner-box">
                    <svg class="ev-checkbox--checkmark" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="ev-checkbox--checkmark-path" d="M3 7.5L6.5 11L13.5 4" stroke="currentColor" stroke-width="2" />
                    </svg>
                </div>
            </div>

            <input ref="inputRef"
                   type="checkbox"
                   role="switch"
                   :id="formField.id"
                   :name="formField.name"
                   :disabled="formField.isDisabled"
                   :readonly="formField.isReadonly"
                   :checked="isChecked"
                   :value="trueValue"
                   :aria-disabled="formField.isDisabled"
                   :aria-checked="isChecked"
                   @input="onInput"
                   @focus="focus"
                   @blur="blur"
                   v-bind="inputAttrs" />
        </div>

        <div class="ev-checkbox--label" v-if="props.label || slots.label">
            <ev-label :for="formField.id" clickable>
                <slot name="label">{{ props.label }}</slot>
            </ev-label>
        </div>
    </div>
</template>
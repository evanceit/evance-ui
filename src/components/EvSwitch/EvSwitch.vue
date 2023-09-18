<script setup lang="ts">
/**
 * # `<ev-switch>`
 */
import './EvSwitch.scss';
import {ref, useAttrs, useSlots} from "vue";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {splitInputAttrs} from "@/util";
import {useFocus} from "@/composables/focus.ts";
import {EvLabel, makeEvSwitchProps, useToggleControl} from "@/components";
import {useFormField} from "@/composables/validation.ts";

/**
 * We want to pass attributes not defined as 'props'
 * to the `<input>` field, so we need to turn off `inheritAttrs`.
 */
defineOptions({
    inheritAttrs: false
});

// Props & slots
const props = defineProps(makeEvSwitchProps());
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
        class="ev-switch"
        :class="[
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
        <div class="ev-switch--control">
            <div class="ev-switch--track"></div>
            <div class="ev-switch--thumb"></div>
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
                   v-bind="inputAttrs"
            >
        </div>

        <div class="ev-switch--label" v-if="props.label || slots.label">
            <ev-label :for="formField.id" clickable>
                <slot name="label">{{ props.label }}</slot>
            </ev-label>
        </div>

    </div>
</template>
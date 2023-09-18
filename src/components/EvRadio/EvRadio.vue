<script setup lang="ts">
/**
 * # `<ev-radio>`
 */
import './EvRadio.scss';
import {computed, ref, useAttrs, useSlots} from "vue";
import {isDeepEqual, splitInputAttrs} from "@/util";
import {EvLabel, makeEvRadioProps} from "@/components";
import {useFormField} from "@/composables/validation.ts";

/**
 * We want to pass attributes not defined as 'props'
 * to the `<input>` field, so we need to turn off `inheritAttrs`.
 */
defineOptions({
    inheritAttrs: false
});

// Props & slots
const props = defineProps(makeEvRadioProps());
const slots = useSlots();

// Emit
const emit = defineEmits([
    'update:focused',
    'update:modelValue'
]);

const attrs = useAttrs();
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const [ containerAttrs, inputAttrs ] = splitInputAttrs(attrs);
const formField = useFormField(props);
const valueComparator = isDeepEqual;

// Computed
const isChecked = computed({
    get() {
        return valueComparator(formField.value, props.value);
    },
    set(value: boolean) {
        if (props.readonly) { return; }
        let newValue = value ? props.value : null;
        // I might do some funky stuff here later
        formField.value = newValue;
    }
});


/**
 * # On Click
 *
 * Handle clearable radio buttons when the input is checked and is then clicked again.
 *
 * @param e
 */
function onClick(e: Event): void {
    if (isChecked.value && props.clearable) {
        isChecked.value = false;
    }

}

/**
 * ## On Input
 *
 * Handle changes to the checked state.
 *
 * @param e
 */
function onInput(e: Event): void {
    isChecked.value = (e.target as HTMLInputElement).checked;
}

/**
 * # On Space
 *
 * We need this event handler to handle clearable radio, because
 * the `click` event is not triggered when the input is checked.
 *
 * @param e
 */
function onSpace(e: Event): void {
    if (isChecked.value && props.clearable) {
        isChecked.value = false;
        // Prevent default to avoid the click event being triggered.
        e.preventDefault();
    }
}

/**
 * ## Get Input Element
 */
function getInputElement(): HTMLInputElement | null {
  return inputRef.value;
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
            'ev-radio',
            {
               'is-checked': isChecked,
               'is-labelled': props.label || slots.label
            },
            formField.classes,
            props.class
        ]"
         :style="props.style"
         v-bind="containerAttrs"
    >
        <div class="ev-radio--control">
            <div class="ev-radio--circles">
                <div class="ev-radio--outer-circle"></div>
                <div class="ev-radio--inner-circle"></div>
            </div>
            <input ref="inputRef"
                   type="radio"
                   :id="formField.id"
                   :name="formField.name"
                   :disabled="formField.isDisabled"
                   :readonly="formField.isReadonly"
                   :value="value"
                   :checked="isChecked"
                   v-bind="inputAttrs"
                   @blur="formField.blur"
                   @click="onClick"
                   @focus="formField.focus"
                   @input="onInput"
                   @keyup.space="onSpace"
            />
        </div>
        <div class="ev-radio--label" v-if="props.label || slots.label">
            <ev-label :for="formField.id" clickable>
                <slot name="label">{{ props.label }}</slot>
            </ev-label>
        </div>
    </div>
</template>
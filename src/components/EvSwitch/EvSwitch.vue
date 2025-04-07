<script setup lang="ts">
/**
 * # `<ev-switch>`
 */
import "./EvSwitch.scss";
import { ref, useAttrs } from "vue";
import { splitInputAttrs } from "@/util";
import { EvErrors } from "@/components/EvErrors";
import { EvLabel } from "@/components/EvLabel";
import { useToggleControl } from "@/components/EvCheckbox";
import { makeEvSwitchProps } from "./EvSwitch";
import { useFormField } from "@/composables/validation";

/**
 * We want to pass attributes not defined as 'props'
 * to the `<input>` field, so we need to turn off `inheritAttrs`.
 */
defineOptions({
    inheritAttrs: false,
});

// Props & slots
const props = defineProps({
    ...makeEvSwitchProps(),
});
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
    field: formField,
    input: inputRef,
    focus: () => {
        getInputElement()?.focus();
    },
});
</script>

<template>
    <div
        ref="containerRef"
        class="ev-switch"
        :class="[
            {
                'is-checked': isChecked,
                'is-labelled': props.label || slots.label,
            },
            formField.classes,
            props.class,
        ]"
        :style="props.style"
        v-bind="containerAttrs">
        <div class="ev-switch--control">
            <div class="ev-switch--track"></div>
            <div class="ev-switch--thumb"></div>
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
            class="ev-switch--label">
            <ev-label
                clickable
                :for="formField.id"
                :title="props.label"
                :hint="props.hint">
                <slot name="label" />
            </ev-label>

            <div v-if="formField.isShowErrorMessages" class="ev-switch--errors">
                <ev-errors :messages="formField.errorMessages" />
            </div>
        </div>
    </div>
</template>

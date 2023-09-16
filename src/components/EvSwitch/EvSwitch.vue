<script setup lang="ts">
/**
 * # `<ev-switch>`
 */
import './EvSwitch.scss';
import {ref, useAttrs} from "vue";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {splitInputAttrs} from "@/util";
import {useFocus} from "@/composables/focus.ts";
import {makeEvSwitchProps} from "@/components";
import {useFormField} from "@/composables/validation.ts";

/**
 * We want to pass attributes not defined as 'props'
 * to the `<input>` field, so we need to turn off `inheritAttrs`.
 */
defineOptions({
    inheritAttrs: false
});

/**
 * # Switch Props
 */
const props = defineProps(makeEvSwitchProps());

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
        class="ev-switch"
        :class="[
            {
                'is-checked': modelProxy
            },
            formField.classes,
            focusClasses,
            props.class
        ]"
         :style="props.style"
        v-bind="containerAttrs"
    >
        <div class="ev-switch--track"></div>
        <div class="ev-switch--thumb"></div>
        <input ref="inputRef"
               type="checkbox"
               role="switch"
               :id="formField.id"
               :name="formField.name"
               :disabled="formField.isDisabled"
               :readonly="formField.isReadonly"
               v-model="modelProxy"
               v-bind="inputAttrs"
               @focus="focus"
               @blur="blur"
               :aria-checked="modelProxy"
        >
    </div>
</template>
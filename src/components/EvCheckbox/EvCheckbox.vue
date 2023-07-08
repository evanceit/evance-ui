<script lang="ts">
/**
 * # `<ev-checkbox>`
 *
 * We want to pass attributes not defined as 'props'
 * to the `<input>` field, so we need to turn off `inheritAttrs`.
 * This cannot be done inside the `<script setup>` tag.
 */
export default {
    inheritAttrs: false
}
</script>
<script setup lang="ts">
import './EvCheckbox.scss';
import {ref, useAttrs} from "vue";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {splitInputAttrs} from "../../util";
import {useFocus} from "../../composables/focus.ts";


/**
 * # Checkbox Props
 */
interface CheckboxProps {
    disabled?: boolean,
    id?: string,
    focused?: boolean,
    modelValue?: string,
    readonly?: boolean,
    value?: string
}
const props = withDefaults(defineProps<CheckboxProps>(), {
    disabled: false,
    focused: false,
    readonly: false
});

// Emit
const emit = defineEmits([
    'update:focused',
    'update:modelValue'
]);

const attrs = useAttrs();
const container = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const modelProxy = useModelProxy(props, 'modelValue');
const [ containerAttrs, inputAttrs ] = splitInputAttrs(attrs);
const { focusClasses, focus, blur } = useFocus(props);


</script>
<template>
    <div ref="container"
         class="ev-checkbox"
         :class="[
            {
                'is-checked': modelProxy,
                'is-disabled': disabled
            },
            focusClasses
        ]"
         v-bind="containerAttrs"
    >
        <div class="ev-checkbox--control">

            <div class="ev-checkbox--checkmark">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path class="ev-checkbox--checkmark-path" d="M3 7.5L6.5 11L13.5 4" stroke="currentColor" stroke-width="2" />
                </svg>
            </div>

            <input ref="input"
                   type="checkbox"
                   role="switch"
                   :id="id"
                   :disabled="disabled"
                   v-model="modelProxy"
                   v-bind="inputAttrs"
                   @focus="focus"
                   @blur="blur" />
        </div>
    </div>
</template>
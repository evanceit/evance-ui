<script lang="ts">
/**
 * # `<ev-switch>`
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
import './EvSwitch.scss';
import {ref, useAttrs} from "vue";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {splitInputAttrs} from "../../util";
import {useFocus} from "../../composables/focus.ts";

/**
 * # Switch Props
 */
interface SwitchProps {
    disabled?: boolean,
    id?: string,
    focused?: boolean,
    modelValue?: boolean,
}
const props = withDefaults(defineProps<SwitchProps>(), {
    disabled: false,
    focused: false
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
    <div
        ref="container"
        class="ev-switch"
        :class="[
            {
                'is-checked': modelProxy,
                'is-disabled': disabled
            },
            focusClasses
        ]"
        v-bind="containerAttrs"
    >
        <div class="ev-switch--track"></div>
        <div class="ev-switch--thumb"></div>
        <input
            ref="input"
            type="checkbox"
            role="switch"
            :id="id"
            :disabled="disabled"
            v-model="modelProxy"
            v-bind="inputAttrs"
            @focus="focus"
            @blur="blur"
        >
    </div>
</template>
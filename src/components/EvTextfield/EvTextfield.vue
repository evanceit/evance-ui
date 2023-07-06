<script lang="ts">
/**
 * # `<ev-textfield>`
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
import './EvTextfield.scss';
import {computed, nextTick, ref, useAttrs, useSlots} from "vue";
import EvIcon from "../EvIcon/EvIcon.vue";
import {Cancel} from "../../icons";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {splitInputAttrs} from "../../util";
import {useFocus} from "../../composables/focus.ts";

const attrs = useAttrs();
const container = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const slots = useSlots();
const [containerAttrs, inputAttrs] = splitInputAttrs(attrs);

// Props
interface TextfieldProps {
    autofocus?: boolean,
    autoselect?: boolean,
    clearable?:boolean,
    disabled?: boolean,
    focused?: boolean,
    icon?: Object,
    name?: string,
    placeholder?: string,
    prefix?: string,
    readonly?: boolean,
    suffix?: string,
    modelValue?: string,
    type?: string
}
const props = withDefaults(defineProps<TextfieldProps>(), {
    autofocus: false,
    autoselect: false,
    clearable: false,
    disabled: false,
    focused: false,
    readonly: false,
    type: 'text'
});

// Emit
const emit = defineEmits([
    'click:clear',
    'update:modelValue'
]);

const modelProxy = useModelProxy(props, 'modelValue');
const { isFocused, focusClasses, focus, blur } = useFocus(props);

const isClearable = computed(() => {
    return (props.clearable && !!modelProxy.value);
});

/**
 * ## Get Input Element
 */
function getInputElement(): HTMLInputElement | null {
    return input.value;
}

/**
 * ## On Click Clearable
 * @param $event
 */
function onClickClearable($event: MouseEvent) {
    $event.stopPropagation();
    nextTick(() => {
        modelProxy.value = null;
        emit('click:clear', $event);
    });
    getInputElement()?.focus();
}

/**
 * ## On Focus
 * @param $event
 */
function onFocus($event) {
    focus();
    if (props.autoselect) {
        getInputElement()?.select();
    }
}

/**
 * ## Directive `v-autofocus`
 */
const vAutofocus = {
    mounted: (el) => {
        if (!props.autofocus) {
            return;
        }
        el.focus();
    }
};

</script>
<template>
    <div
        ref="container"
        class="ev-textfield"
        :class="[
            {
                'is-disabled': disabled
            },
            focusClasses
        ]"
        v-bind="containerAttrs"
    >
        <div class="ev-textfield--icon" v-if="icon || slots.icon">
            <slot name="icon"><ev-icon :glyph="icon" /></slot>
        </div>
        <div class="ev-textfield--prefix" v-if="prefix || slots.prefix">
            <slot name="prefix">{{ prefix }}</slot>
        </div>
        <div class="ev-textfield--input">
            <input
                ref="input"
                :type="type"
                :name="name"
                :value="modelProxy"
                :placeholder="placeholder"
                :disabled="disabled"
                :autofocus="autofocus"
                :readonly="readonly"
                v-autofocus
                v-bind="inputAttrs"
                @focus="onFocus($event)"
                @blur="blur()"
                @input="$emit('update:modelValue', $event.target.value)"
            />
        </div>
        <transition name="slide-fade">
            <div class="ev-textfield--clearable" v-if="isClearable">
                <ev-icon :glyph="Cancel" @click="onClickClearable($event)" />
            </div>
        </transition>
        <div class="ev-textfield--suffix" v-if="suffix || slots.suffix">
            <slot name="suffix">{{ suffix }}</slot>
        </div>
    </div>
</template>
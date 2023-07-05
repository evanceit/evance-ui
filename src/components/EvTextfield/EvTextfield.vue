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
import {ref, useAttrs, useSlots} from "vue";
import EvIcon from "../EvIcon/EvIcon.vue";
import {Cancel} from "../../icons";

const attrs = useAttrs();
const container = ref<HTMLElement | null>(null);
const input = ref<HTMLElement | null>(null);
const isFocused = ref<boolean>(false);
const slots = useSlots();

// Props
interface TextfieldProps {
    autofocus?: boolean,
    autoselect?: boolean,
    clearable?:boolean,
    disabled?: boolean,
    icon?: Object,
    name?: string,
    placeholder?: string,
    prefix?: string,
    suffix?: string,
    modelValue?: string,
    type?: string
}
const props = withDefaults(defineProps<TextfieldProps>(), {
    autofocus: false,
    autoselect: false,
    clearable: false,
    disabled: false,
    type: 'text'
});

// Emit
const emit = defineEmits([
    'update:modelValue'
]);

/**
 * ## Get Input Element
 */
function getInputElement(): HTMLElement | null {
    return input.value;
}

function onClickClearable($event) {
    getInputElement().value = '';
    emit('update:modelValue', '');
}

/**
 * ## On Focus
 * @param $event
 */
function onFocus($event) {
    isFocused.value = true;
    if (props.autoselect) {
        getInputElement().select();
    }
}

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
            }
        ]"
    >
        <div
            class="ev-textfield--icon"
            v-if="icon || slots.icon">
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
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :autofocus="autofocus"
                v-autofocus
                @focus="onFocus($event)"
                @input="$emit('update:modelValue', $event.target.value)"
            />
        </div>
        <transition name="slide-fade">
            <div class="ev-textfield--clearable" v-if="clearable && getInputElement().value" @click="onClickClearable()">
                <slot name="clear"><ev-icon :glyph="Cancel" /></slot>
            </div>
        </transition>
        <div class="ev-textfield--suffix" v-if="suffix || slots.suffix">
            <slot name="suffix">{{ suffix }}</slot>
        </div>
    </div>
</template>
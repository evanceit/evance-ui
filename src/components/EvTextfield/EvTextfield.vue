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
import {appearanceModifier, sizeModifier, splitInputAttrs} from "../../util";
import {useFocus} from "../../composables/focus.ts";
import EvProgress from "../EvProgress/EvProgress.vue";
import EvProgressCircular from "../EvProgressCircular/EvProgressCircular.vue";

/**
 * ## Appearance
 */
type Appearance = 'default'
    | 'none'
    | 'subtle';

/**
 * ## Button Size
 */
type Size = 'small'
    | 'medium'
    | 'large';

// Props
interface TextfieldProps {
    appearance?: Appearance,
    autofocus?: boolean,
    autoselect?: boolean,
    clearable?: boolean,
    disabled?: boolean,
    focused?: boolean,
    icon?: Object,
    id?: string,
    loading?: boolean,
    name?: string,
    placeholder?: string,
    prefix?: string,
    readonly?: boolean,
    suffix?: string,
    modelValue?: string,
    size?: Size,
    type?: string
}
const props = withDefaults(defineProps<TextfieldProps>(), {
    appearance: 'default',
    autofocus: false,
    autoselect: false,
    clearable: false,
    disabled: false,
    focused: false,
    loading: false,
    readonly: false,
    size: 'medium',
    type: 'text'
});

// Emit
const emit = defineEmits([
    'click:clear',
    'update:focused',
    'update:modelValue'
]);

const attrs = useAttrs();
const container = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const slots = useSlots();
const [ containerAttrs, inputAttrs ] = splitInputAttrs(attrs);
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
 * @param e
 */
function onFocus(e: Event) {
    focus(e);
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
                'is-disabled': disabled,
                'is-loading': loading
            },
            focusClasses,
            sizeModifier(props.size, ['medium']),
            appearanceModifier(props.appearance, ['default'])
        ]"
        role="textbox"
        v-bind="containerAttrs"
    >
        <div class="ev-textfield--icon" v-if="icon">
            <transition name="fade-in-out" mode="out-in">
                <ev-icon v-if="!loading" :glyph="icon" />
                <ev-progress-circular v-else  indeterminate :appearance="isFocused ? 'primary' : 'default'" />
            </transition>
        </div>
        <div class="ev-textfield--prefix" v-if="prefix || slots.prefix">
            <slot name="prefix">{{ prefix }}</slot>
        </div>
        <div class="ev-textfield--input">
            <input
                ref="input"
                :type="type"
                :id="id"
                :name="name"
                v-model="modelProxy"
                :placeholder="placeholder"
                :disabled="disabled"
                :autofocus="autofocus"
                :readonly="readonly"
                v-autofocus
                v-bind="inputAttrs"
                @focus="onFocus"
                @blur="blur"
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
        <div class="ev-textfield--loader" v-if="loading && !icon">
            <ev-progress indeterminate :appearance="isFocused ? 'primary' : 'default'" size="2" />
        </div>
    </div>
</template>
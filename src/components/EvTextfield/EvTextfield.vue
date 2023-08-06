<script setup lang="ts">
/**
 * # `<ev-textfield>`
 */
import './EvTextfield.scss';
import {computed, nextTick, ref, useAttrs, useSlots} from "vue";
import EvIcon from "../EvIcon/EvIcon.vue";
import {Cancel} from "../../icons";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {Appearance, appearanceModifier, InputAppearance, InputSize, sizeModifier, splitInputAttrs} from "../../util";
import {useAutofocus, useFocus} from "../../composables/focus.ts";
import EvProgress from "../EvProgress/EvProgress.vue";
import EvProgressCircular from "../EvProgressCircular/EvProgressCircular.vue";
import {makeEvTextfieldProps} from "./EvTextfield.ts";


/**
 * We want to pass attributes not defined as 'props'
 * to the `<input>` field, so we need to turn off `inheritAttrs`.
 */
defineOptions({
    inheritAttrs: false
});

// Props
const props = defineProps(makeEvTextfieldProps());

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
const vAutofocus = useAutofocus(props);

</script>
<template>
    <div
        ref="container"
        class="ev-textfield"
        :class="[
            {
                'is-disabled': disabled,
                'is-loading': loading,
                'is-rounded': rounded
            },
            focusClasses,
            sizeModifier(props.size, [InputSize.default]),
            appearanceModifier(props.appearance, [InputAppearance.default])
        ]"
        role="textbox"
        v-bind="containerAttrs"
    >
        <div class="ev-textfield--icon" v-if="iconStart">
            <transition name="fade-in-out" mode="out-in">
                <ev-icon v-if="!loading" :glyph="iconStart" />
                <ev-progress-circular v-else  indeterminate :appearance="isFocused ? Appearance.notice : Appearance.default" />
            </transition>
        </div>
        <div class="ev-textfield--prefix" v-if="prefix || slots.prefix">
            <slot name="prefix">{{ prefix }}</slot>
        </div>
        <div class="ev-textfield--input">
            <slot />
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
        <div class="ev-textfield--icon" v-if="iconEnd">
            <ev-icon :glyph="iconEnd" />
        </div>
        <div class="ev-textfield--loader" v-if="loading && !iconStart">
            <ev-progress indeterminate :appearance="isFocused ? Appearance.notice : Appearance.default" size="2" />
        </div>
    </div>
</template>
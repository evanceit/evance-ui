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
import {MouseEvent} from "react";
import {useIcon} from "../EvIcon";


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
    'click:control',
    'mousedown:control',
    'update:focused',
    'update:modelValue'
]);

const attrs = useAttrs();
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const slots = useSlots();
const [ containerAttrs, inputAttrs ] = splitInputAttrs(attrs);
const modelProxy = useModelProxy(props, 'modelValue');
const { isFocused, focusClasses, focus, blur } = useFocus(props);
const isClearable = computed(() => {
    return (props.clearable && !!modelProxy.value);
});
const iconStart = useIcon(props, 'iconStart');
const iconEnd = useIcon(props, 'iconEnd');

/**
 * ## Get Input Element
 */
function getInputElement(): HTMLInputElement | null {
    return inputRef.value;
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
 * ## On Control Click
 *
 * When the user clicks on the textfield.
 *
 * @param e
 */
function onControlClick(e: MouseEvent) {
    onFocus();
    emit('click:control', e);
}

/**
 * ## On Control Mousedown
 *
 * When the mousedown is triggered on the textfield.
 *
 * @param e
 */
function onControlMousedown(e: MouseEvent) {
    emit('mousedown:control', e);
    if (e.target === inputRef.value) {
        return;
    }
    onFocus();
    e.preventDefault();
}

/**
 * ## Directive `v-autofocus`
 */
const vAutofocus = useAutofocus(props);

/**
 * ## Expose stuff
 */
defineExpose({
    input: inputRef
});

</script>
<template>
    <div
        ref="containerRef"
        class="ev-textfield"
        :class="[
            {
                'is-disabled': props.disabled,
                'is-loading': props.loading,
                'is-rounded': props.rounded
            },
            focusClasses,
            sizeModifier(props.size, [InputSize.default]),
            appearanceModifier(props.appearance, [InputAppearance.default])
        ]"
        role="textbox"
        v-bind="containerAttrs"
        @click="onControlClick"
        @mousedown="onControlMousedown"
    >
        <div class="ev-textfield--icon-start" v-if="iconStart">
            <transition name="fade-in-out" mode="out-in">
                <ev-icon v-if="!props.loading" :glyph="iconStart" />
                <ev-progress-circular v-else  indeterminate :appearance="isFocused ? Appearance.notice : Appearance.default" />
            </transition>
        </div>
        <div class="ev-textfield--prefix" v-if="props.prefix || slots.prefix">
            <slot name="prefix">{{ props.prefix }}</slot>
        </div>
        <div class="ev-textfield--input" data-no-activator>
            <slot />
            <input
                ref="inputRef"
                :type="props.type"
                :id="props.id"
                :name="props.name"
                v-model="modelProxy"
                :placeholder="props.placeholder"
                :disabled="props.disabled"
                :autofocus="props.autofocus"
                :readonly="props.readonly"
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
        <div class="ev-textfield--suffix" v-if="props.suffix || slots.suffix">
            <slot name="suffix">{{ props.suffix }}</slot>
        </div>
        <div class="ev-textfield--icon-end" v-if="iconEnd">
            <ev-icon :glyph="iconEnd" />
        </div>
        <div class="ev-textfield--loader" v-if="props.loading && !props.iconStart">
            <ev-progress indeterminate :appearance="isFocused ? Appearance.notice : Appearance.default" size="2" />
        </div>
    </div>
</template>
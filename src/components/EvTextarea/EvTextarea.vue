<script setup lang="ts">
/**
 * # `<ev-textarea>`
 */
import './EvTextarea.scss';
import {computed, nextTick, ref, useAttrs, onUpdated, onMounted} from "vue";
import {Appearance, appearanceModifier, InputAppearance, InputAppearanceProp, splitInputAttrs} from "../../util";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {useAutofocus, useFocus} from "../../composables/focus.ts";
import {Cancel} from "../../icons";
import EvProgress from "../EvProgress/EvProgress.vue";
import EvIcon from "../EvIcon/EvIcon.vue";
import {makeEvTextareaProps} from "@/components";
import {useFormField} from "@/composables/validation.ts";
import {MouseEvent} from "react";


/**
 * We want to pass attributes not defined as 'props'
 * to the `<input>` field, so we need to turn off `inheritAttrs`.
 */
defineOptions({
    inheritAttrs: false
});

const props = defineProps(makeEvTextareaProps());

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
const [ containerAttrs, inputAttrs ] = splitInputAttrs(attrs);
const modelProxy = useModelProxy(props, 'modelValue');
const { isFocused, focusClasses, focus, blur } = useFocus(props);
const isClearable = computed(() => {
    return (props.clearable && !!modelProxy.value);
});
const formField = useFormField(modelProxy, props);

/**
 * ## Get Input Element
 */
function getInputElement(): HTMLInputElement | null {
    return inputRef.value;
}

/**
 * ## On Clearable Click
 * @param $event
 */
function onClearableClick($event: MouseEvent) {
    $event.stopPropagation();
    nextTick(() => {
        modelProxy.value = null;
        emit('click:clear', $event);
    });
    getInputElement()?.focus();
}

/**
 * ## On Clearable Mousedown
 * @param e
 */
function onClearableMousedown(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}

/**
 * ## On Focus
 * @param e
 */
function onFocus(e?: Event) {
  focus(e);
  if (props.autoselect) {
    getInputElement()?.select();
  }
}

/**
 * ## On Control Click
 *
 * When the user clicks on the textarea.
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
 * When the mousedown is triggered on the textarea.
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
 * ## On Keydown
 * Attempt to resize the textarea on key down.
 * @param e
 */
function onKeydown(e: Event) {
    resize();
}

/**
 * ## On Keyup
 * Attempt to resize the textarea on key up.
 * @param e
 */
function onKeyup(e: Event) {
    resize();
}

/**
 * ## On Enter
 * When the user presses the Enter key, we can call an `autosubmit` function (if supplied).
 * @param e
 */
function onKeyupEnter(e: Event) {
    // Use the autosubmit callback if present
    if (props.autosubmit) {
        props.autosubmit();
    }
}

/**
 * ## Resize
 * If the component is set to `autogrow` then we resize the textarea appropriately
 * so that all the text is visible.
 */
function resize() {
    if (!props.autogrow) {
        return;
    }
    const field = getInputElement();
    if (!field) {
      return;
    }
    field.style.height = 'auto';
    field.style.height = (field.scrollHeight + 1) + 'px';
}

/**
 * ## On Update
 * Ensures the textarea is resized when the component updates.
 */
onUpdated(() => {
    resize();
});

/**
 * ## On Mounted
 * Ensures the textarea is resized when the component loads.
 */
onMounted(() => {
    resize();
});

/**
 * ## Directive `v-autofocus`
 */
const vAutofocus = useAutofocus(props);

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
    <div
        ref="containerRef"
        class="ev-textarea"
        :class="[
            {
                'is-loading': loading,
                'is-autogrow': autogrow
            },
            formField.classes,
            focusClasses,
            appearanceModifier(props.appearance, [InputAppearance.default]),
            props.class
        ]"
        :style="props.style"
        role="textbox"
        v-bind="containerAttrs"
        @click="onControlClick"
        @mousedown="onControlMousedown"
    >
        <div class="ev-textarea--input">
            <textarea
                ref="inputRef"
                :id="formField.id"
                :name="formField.name"
                :disabled="formField.isDisabled"
                :readonly="formField.isReadonly"
                v-model="modelProxy"
                :placeholder="placeholder"
                :autofocus="autofocus"
                v-autofocus
                v-bind="inputAttrs"
                @focus="onFocus"
                @blur="blur"
                @keydown="onKeydown"
                @keyup="onKeyup"
                @keyup.enter="onKeyupEnter"></textarea>
        </div>
        <transition name="slide-fade">
            <div class="ev-textarea--clearable" v-if="isClearable">
                <ev-icon
                    :glyph="Cancel"
                    @click="onClearableClick"
                    @mousedown="onClearableMousedown"
                />
            </div>
        </transition>
        <div class="ev-textarea--loader" v-if="loading && !icon">
            <ev-progress indeterminate :appearance="isFocused ? Appearance.notice : Appearance.default" size="2" />
        </div>
    </div>
</template>
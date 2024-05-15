<script setup lang="ts">
/**
 * # `<ev-textarea>`
 */
import "./EvTextarea.scss";
import { makeEvTextareaProps } from "./EvTextarea.ts";
import { computed, nextTick, ref, useAttrs, onUpdated, onMounted } from "vue";
import {
    Appearance,
    appearanceModifier,
    InputAppearance,
    splitInputAttrs,
} from "@/util";
import { useAutofocus } from "@/composables/focus.ts";
import { Cancel } from "@/icons";
import { EvProgress } from "@/components/EvProgress";
import { EvIcon } from "@/components/EvIcon";
import { EvErrors } from "@/components/EvErrors";
import { EvLabel } from "@/components/EvLabel";
import { useFormField } from "@/composables/validation.ts";

/**
 * We want to pass attributes not defined as 'props'
 * to the `<input>` field, so we need to turn off `inheritAttrs`.
 */
defineOptions({
    inheritAttrs: false,
});

const props = defineProps({
    ...makeEvTextareaProps(),
});
const slots = defineSlots<{
    label(): never;
}>();

// Emit
const emit = defineEmits([
    "click:clear",
    "click:control",
    "mousedown:control",
    "update:focused",
    "update:modelValue",
]);

const attrs = useAttrs();
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const [containerAttrs, inputAttrs] = splitInputAttrs(attrs);
const formField = useFormField(props);
const isClearable = computed(() => {
    return props.clearable && !!formField.value;
});

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
        formField.value = null;
        emit("click:clear", $event);
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
    formField.focus(e);
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
    emit("click:control", e);
}

/**
 * ## On Control Mousedown
 *
 * When the mousedown is triggered on the textarea.
 *
 * @param e
 */
function onControlMousedown(e: MouseEvent) {
    emit("mousedown:control", e);
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
    field.style.height = "auto";
    field.style.height = field.scrollHeight + 1 + "px";
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
    ...formField.expose(),
});
</script>

<template>
    <div
        ref="containerRef"
        class="ev-textarea"
        :class="[
            {
                'is-loading': loading,
                'is-autogrow': autogrow,
            },
            formField.classes,
            props.class,
        ]"
        :style="props.style"
        role="textbox"
        v-bind="containerAttrs">
        <div v-if="props.label || slots.label" class="ev-textarea--label">
            <ev-label :for="formField.id">
                <slot name="label">{{ props.label }}</slot>
            </ev-label>
        </div>

        <div
            :class="[
                'ev-textarea--control',
                appearanceModifier(props.appearance, [InputAppearance.default]),
            ]"
            @click="onControlClick"
            @mousedown="onControlMousedown">
            <div class="ev-textarea--input">
                <textarea
                    :id="formField.id"
                    ref="inputRef"
                    v-model="formField.value"
                    v-autofocus
                    :name="formField.name"
                    :disabled="formField.isDisabled"
                    :readonly="formField.isReadonly"
                    :placeholder="placeholder"
                    :autofocus="autofocus"
                    v-bind="inputAttrs"
                    @focus="onFocus"
                    @blur="formField.blur"
                    @keydown="onKeydown"
                    @keyup="onKeyup"
                    @keyup.enter="onKeyupEnter"></textarea>
            </div>
            <transition name="slide-fade">
                <div v-if="isClearable" class="ev-textarea--clearable">
                    <ev-icon
                        :glyph="Cancel"
                        @click="onClearableClick"
                        @mousedown="onClearableMousedown" />
                </div>
            </transition>
            <div v-if="loading" class="ev-textarea--loader">
                <ev-progress
                    indeterminate
                    :appearance="
                        formField.isFocused
                            ? Appearance.notice
                            : Appearance.default
                    "
                    :size="2" />
            </div>
        </div>

        <div v-if="formField.isShowErrorMessages" class="ev-textarea--errors">
            <ev-errors :messages="formField.errorMessages" />
        </div>
    </div>
</template>

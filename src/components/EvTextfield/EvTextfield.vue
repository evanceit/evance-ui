<script setup lang="ts">
/**
 * # `<ev-textfield>`
 */
import "./EvTextfield.scss";
import { makeEvTextfieldProps } from "./EvTextfield.ts";
import { computed, nextTick, ref, useAttrs } from "vue";
import { EvIcon, useIcon } from "@/components/EvIcon";
import { Cancel } from "@/icons";
import {
    Appearance,
    appearanceModifier,
    InputAppearance,
    InputSize,
    makeClassName,
    sizeModifier,
    splitInputAttrs,
    TextAlign,
} from "@/util";
import { useAutofocus } from "@/composables/focus.ts";
import { EvLabel } from "@/components/EvLabel";
import { EvErrors } from "@/components/EvErrors";
import { EvProgress } from "@/components/EvProgress";
import { EvProgressCircular } from "@/components/EvProgressCircular";
import { useFormField } from "@/composables/validation.ts";

/**
 * We want to pass attributes not defined as 'props'
 * to the `<input>` field, so we need to turn off `inheritAttrs`.
 */
defineOptions({
    inheritAttrs: false,
});

// Props & slots
const props = defineProps({
    ...makeEvTextfieldProps(),
});
const slots = defineSlots<{
    label(): never;
    prefix(): never;
    default(): never;
    suffix(): never;
}>();

// Emit
const emit = defineEmits([
    "click:clear",
    "click:control",
    "click:outside",
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
const iconStart = useIcon(props, "iconStart");
const iconEnd = useIcon(props, "iconEnd");

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
    if (!props.readonly) {
        getInputElement()?.focus();
    }
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
 * When the user clicks on the textfield.
 *
 * @param e
 */
function onControlClick(e: MouseEvent) {
    inputRef.value?.focus(e as FocusOptions);
    emit("click:control", e);
}

/**
 * ## On Control Mousedown
 *
 * When the mousedown is triggered on the textfield.
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

function onClickOutside(e: MouseEvent) {
    emit("click:outside");
}
</script>

<template>
    <div
        ref="containerRef"
        v-click-outside="onClickOutside"
        :class="[
            'ev-textfield',
            {
                'is-loading': props.loading,
            },
            formField.classes,
            props.class,
        ]"
        :style="props.style"
        v-bind="containerAttrs">
        <div v-if="props.label || slots.label" class="ev-textfield--label">
            <ev-label :for="formField.id">
                <slot name="label">{{ props.label }}</slot>
            </ev-label>
        </div>

        <div
            :class="[
                'ev-textfield--control',
                {
                    'is-rounded': props.rounded,
                    'is-monospace': !!props.monospace,
                },
                appearanceModifier(props.appearance, [InputAppearance.default]),
                sizeModifier(props.size, [InputSize.default]),
                makeClassName(props.align, 'is-align', [TextAlign.default]),
            ]"
            :role="props.role"
            @click="onControlClick"
            @mousedown="onControlMousedown">
            <div v-if="iconStart" class="ev-textfield--icon-start">
                <transition name="fade-in-out" mode="out-in">
                    <ev-icon v-if="!props.loading" :glyph="iconStart" />
                    <ev-progress-circular
                        v-else
                        indeterminate
                        :appearance="
                            formField.isFocused
                                ? Appearance.notice
                                : Appearance.default
                        " />
                </transition>
            </div>
            <div
                v-if="props.prefix || slots.prefix"
                class="ev-textfield--prefix">
                <slot name="prefix">{{ props.prefix }}</slot>
            </div>
            <div class="ev-textfield--input" data-no-activator>
                <slot />
                <input
                    :id="formField.id"
                    ref="inputRef"
                    v-model="formField.value"
                    v-autofocus
                    class="ev-textfield--input-native"
                    :type="props.type"
                    :name="formField.name"
                    :disabled="formField.isDisabled"
                    :readonly="formField.isReadonly"
                    :autofocus="props.autofocus"
                    :placeholder="props.placeholder"
                    v-bind="inputAttrs"
                    @focus="onFocus"
                    @blur="formField.blur" />
            </div>
            <transition name="slide-fade">
                <div v-if="isClearable" class="ev-textfield--clearable">
                    <ev-icon
                        :glyph="Cancel"
                        @click="onClearableClick"
                        @mousedown="onClearableMousedown" />
                </div>
            </transition>
            <div
                v-if="props.suffix || slots.suffix"
                class="ev-textfield--suffix">
                <slot name="suffix">{{ props.suffix }}</slot>
            </div>
            <div v-if="iconEnd" class="ev-textfield--icon-end">
                <ev-icon :glyph="iconEnd" />
            </div>
            <div
                v-if="props.loading && !props.iconStart"
                class="ev-textfield--loader">
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

        <div v-if="formField.isShowErrorMessages" class="ev-textfield--errors">
            <ev-errors :messages="formField.errorMessages" />
        </div>
    </div>
</template>

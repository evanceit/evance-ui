<script lang="ts">
/**
 * # `<ev-textarea>`
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
import './EvTextarea.scss';
import {computed, nextTick, ref, useAttrs, useSlots, onUpdated, onMounted} from "vue";
import {appearanceModifier, sizeModifier, splitInputAttrs} from "../../util";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {useAutofocus, useFocus} from "../../composables/focus.ts";
import {Cancel} from "../../icons";
import EvProgress from "../EvProgress/EvProgress.vue";
import EvIcon from "../EvIcon/EvIcon.vue";

/**
 * ## Appearance
 */
type Appearance = 'default'
    | 'button'
    | 'none'
    | 'subtle';

// Props
interface TextareaProps {
    appearance?: Appearance,
    autofocus?: boolean,
    autogrow?: boolean,
    autosubmit?: Function,
    clearable?: boolean,
    disabled?: boolean,
    focused?: boolean,
    id?: string,
    loading?: boolean,
    name?: string,
    placeholder?: string,
    readonly?: boolean,
    modelValue?: string
}
const props = withDefaults(defineProps<TextareaProps>(), {
    appearance: 'default',
    autofocus: false,
    autogrow: true,
    clearable: false,
    disabled: false,
    focused: false,
    loading: false,
    readonly: false
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

function onKeydown() {
    resize();
}

function onKeyup() {
    resize();
}

function onKeyupEnter() {
    // Use the autosubmit callback if present
    if (props.autosubmit) {
        props.autosubmit();
    }
}

function resize() {
    if (!props.autogrow) {
        return;
    }
    const field = getInputElement();
    field.style.height = 'auto';
    field.style.height = (field.scrollHeight + 1) + 'px';
}

onUpdated(() => {
    resize();
});

onMounted(() => {
    resize();
});

/**
 * ## Directive `v-autofocus`
 */
const vAutofocus = useAutofocus(props);

</script>
<template>
    <div
        ref="container"
        class="ev-textarea"
        :class="[
            {
                'is-disabled': disabled,
                'is-loading': loading,
                'is-autogrow': autogrow
            },
            focusClasses,
            appearanceModifier(props.appearance, ['default'])
        ]"
        role="textbox"
        v-bind="containerAttrs"
    >
        <div class="ev-textarea--input">
            <textarea
                ref="input"
                :id="id"
                :name="name"
                v-model="modelProxy"
                :placeholder="placeholder"
                :disabled="disabled"
                :autofocus="autofocus"
                :readonly="readonly"
                v-autofocus
                v-bind="inputAttrs"
                @focus="focus"
                @blur="blur"
                @keydown="onKeydown"
                @keyup="onKeyup"
                @keyup.enter="onKeyupEnter"></textarea>
        </div>
        <transition name="slide-fade">
            <div class="ev-textarea--clearable" v-if="isClearable">
                <ev-icon :glyph="Cancel" @click="onClickClearable($event)" />
            </div>
        </transition>
        <div class="ev-textarea--loader" v-if="loading && !icon">
            <ev-progress indeterminate :appearance="isFocused ? 'primary' : 'default'" size="2" />
        </div>
    </div>
</template>
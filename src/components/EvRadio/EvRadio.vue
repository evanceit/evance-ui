<script lang="ts">
/**
 * # `<ev-radio>`
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
import './EvRadio.scss';
import {computed, ref, useAttrs} from "vue";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {getNextId, isDeepEqual, splitInputAttrs} from "../../util";
import {useFocus} from "../../composables/focus.ts";

/**
 * # Radio Props
 */
interface RadioProps {
    clearable?: boolean,
    disabled?: boolean,
    id?: string,
    focused?: boolean,
    modelValue?: string,
    readonly?: boolean,
    value?: string
}
const props = withDefaults(defineProps<RadioProps>(), {
    clearable: false,
    disabled: false,
    focused: false,
    readonly: false
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
const nextId = getNextId();
const id = computed(() => props.id || `radio-${nextId}`);
const valueComparator = isDeepEqual;

// Computed
const modelChecked = computed({
    get() {
        return valueComparator(modelProxy.value, props.value);
    },
    set(value: boolean) {
        if (props.readonly) { return; }
        let newValue = value ? props.value : null;
        // I might do some funky stuff here later
        modelProxy.value = newValue;
    }
});


/**
 * # On Click
 *
 * Handle clearable radio buttons when the input is checked and is then clicked again.
 *
 * @param e
 */
function onClick(e: Event): void {
    if (modelChecked.value && props.clearable) {
        modelChecked.value = false;
    }
}

/**
 * ## On Input
 *
 * Handle changes to the checked state.
 *
 * @param e
 */
function onInput(e: Event): void {
    modelChecked.value = (e.target as HTMLInputElement).checked;
}

/**
 * # On Space
 *
 * We need this event handler to handle clearable radio, because
 * the `click` event is not triggered when the input is checked.
 *
 * @param e
 */
function onSpace(e: Event): void {
    if (modelChecked.value && props.clearable) {
        modelChecked.value = false;
        // Prevent default to avoid the click event being triggered.
        e.preventDefault();
    }
}

</script>
<template>
    <div ref="container"
         class="ev-radio"
         :class="[
            {
                'is-disabled': disabled,
                'is-checked': modelChecked
            },
            focusClasses
        ]"
        v-bind="containerAttrs"
    >
        <div class="ev-radio--control">
            <div class="ev-radio--circles">
                <div class="ev-radio--outer-circle"></div>
                <div class="ev-radio--inner-circle"></div>
            </div>
            <input ref="input"
                   type="radio"
                   role="switch"
                   :id="id"
                   :disabled="disabled"
                   :readonly="readonly"
                   :value="value"
                   v-model="modelProxy"
                   v-bind="inputAttrs"
                   @blur="blur"
                   @click="onClick"
                   @focus="focus"
                   @input="onInput"
                   @keyup.space="onSpace"
            />
        </div>


    </div>
</template>
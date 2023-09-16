<script setup lang="ts">
/**
 * # `<ev-radio>`
 */
import './EvRadio.scss';
import {computed, ref, useAttrs} from "vue";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {getNextId, isDeepEqual, splitInputAttrs} from "../../util";
import {useFocus} from "../../composables/focus.ts";
import {makeEvRadioProps} from "@/components";
import {useFormField} from "@/composables/validation.ts";

/**
 * We want to pass attributes not defined as 'props'
 * to the `<input>` field, so we need to turn off `inheritAttrs`.
 */
defineOptions({
    inheritAttrs: false
});

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
const props = defineProps(makeEvRadioProps());

// Emit
const emit = defineEmits([
    'update:focused',
    'update:modelValue'
]);

const attrs = useAttrs();
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const modelProxy = useModelProxy(props, 'modelValue');
const [ containerAttrs, inputAttrs ] = splitInputAttrs(attrs);
const { focusClasses, focus, blur } = useFocus(props);
const formField = useFormField(modelProxy, props);
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

/**
 * ## Get Input Element
 */
function getInputElement(): HTMLInputElement | null {
  return inputRef.value;
}

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
    <div ref="containerRef"
         class="ev-radio"
         :class="[
            {
                'is-checked': modelChecked
            },
            formField.classes,
            focusClasses,
            props.class
        ]"
         :style="props.style"
        v-bind="containerAttrs"
    >
        <div class="ev-radio--control">
            <div class="ev-radio--circles">
                <div class="ev-radio--outer-circle"></div>
                <div class="ev-radio--inner-circle"></div>
            </div>
            <input ref="inputRef"
                   type="radio"
                   :id="formField.id"
                   :name="formField.name"
                   :disabled="formField.isDisabled"
                   :readonly="formField.isReadonly"
                   :value="value"
                   :checked="modelChecked"
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
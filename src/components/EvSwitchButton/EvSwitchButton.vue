<script setup lang="ts">
import "./EvSwitchButton.scss";
import {
    EvSwitchButtonSymbol,
    makeEvSwitchButtonProps,
} from "./EvSwitchButton";
import { GroupProps, useGroup } from "@/composables/group";
import { EvButton } from "@/components/EvButton";
import { useModelProxy } from "@/composables";
import { computed, ref, watch } from "vue";

const props = defineProps({
    ...makeEvSwitchButtonProps(),
});

defineEmits(["update:modelValue"]);

const slots = defineSlots<{
    default(): never;
}>();

const model = useModelProxy(props, "modelValue");
const selection = ref(model.value);

useGroup(
    {
        disabled: props.disabled,
        modelValue: selection,
        selectedAppearance: props.selectedAppearance,
        selectedVariant: props.selectedVariant,
        selectedClass: props.selectedClass,
        multiple: false,
        mandatory: false,
    } as any as GroupProps,
    EvSwitchButtonSymbol,
);

watch(selection, (newValue, oldValue) => {
    if (!!newValue !== !!oldValue) {
        model.value = !!newValue;
    }
});

watch(model, (newValue, oldValue) => {
    if (!!newValue !== !!oldValue) {
        selection.value = !!newValue;
    }
});

const label = computed(() => {
    if (model.value && props.selectedText) {
        return props.selectedText;
    }
    return props.text;
});
</script>

<template>
    <ev-button
        v-bind="props"
        :value="true"
        :symbol="EvSwitchButtonSymbol"
        :text="label" />
</template>

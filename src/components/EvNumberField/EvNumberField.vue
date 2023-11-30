<script setup lang="ts">
/**
 * `<ev-number-field>`
 */
import './EvNumberField.scss';
import {makeEvNumberFieldProps} from "./EvNumberField.ts";
import {EvTextfield} from "@/components/EvTextfield";
import {computed, ref, useSlots} from "vue";
import {filterComponentProps, omit} from "@/util";


const props = defineProps(makeEvNumberFieldProps());
const slots = useSlots();

// EvTextfield
const evTextfieldRef = ref<EvTextfield>();
const evTextfieldProps = computed(() => {
  return omit(filterComponentProps(EvTextfield, props), ['modelValue']);
});

</script>
<template>
    <ev-textfield
        ref="evTextfieldRef"
        class="ev-number-field"
        v-bind="evTextfieldProps"
    >
      <template #label v-if="props.label || slots.label">
        <slot name="label">{{ props.label }}</slot>
      </template>
    </ev-textfield>
</template>
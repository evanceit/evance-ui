<script setup lang="ts">
/**
 * `<ev-number-field>`
 */
import './EvNumberField.scss';
import {makeEvNumberFieldProps} from "./EvNumberField.ts";
import {EvTextfield} from "@/components/EvTextfield";

const props = defineProps(makeEvNumberFieldProps());

</script>
<template>
    <ev-textfield
        class="ev-number-field"

    >
    </ev-textfield>
</template>
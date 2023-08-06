<script setup lang="ts">
/**
 * # EvSelect
 *
 */
import './EvSelect.scss';
import EvTextfield from "../EvTextfield/EvTextfield.vue";
import {computed, ref} from "vue";
import {makeEvSelectProps} from "./EvSelect.ts";
import {filterComponentProps} from "../../util";

// Props
const props = defineProps(makeEvSelectProps());

// TextField Stuff
const evTextfieldRef = ref();
const evTextfieldProps = computed(() => {
   return filterComponentProps(EvTextfield, props);
});

</script>
<template>

    <ev-textfield
        readonly
        ref="evTextfieldRef"
        class="ev-select"
        v-bind="evTextfieldProps"
    >
        <template #default>
            <div class="ev-select--selected">My Selected value</div>
        </template>
    </ev-textfield>
</template>
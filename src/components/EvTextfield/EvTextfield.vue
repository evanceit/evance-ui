<script lang="ts">
/**
 * # `<ev-textfield>`
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
import './EvTextfield.scss';
import {ref, useAttrs} from "vue";
import EvIcon from "../EvIcon/EvIcon.vue";
import {Search} from "../../icons";
import EvButton from "../EvButton/EvButton.vue";

const attrs = useAttrs();
const container = ref<HTMLElement | null>(null);
const input = ref<HTMLElement | null>(null);

/**
 * ## Get Input Element
 */
function getInputElement(): HTMLElement | null {
    return input.value;
}

</script>
<template>
    <div
        ref="container"
        class="ev-textfield"
    >
        <div class="ev-textfield--icon">
            <ev-icon :glyph="Search" />
        </div>
        <div class="ev-textfield--prefix">
            $
        </div>
        <div class="ev-textfield--input">
            <input
                ref="input"
            />
        </div>
        <div class="ev-textfield--suffix">USD</div>
    </div>
</template>
<script setup lang="ts">
import './EvTag.scss';
import {makeEvTagProps} from "./EvTag.ts";
import {EvIcon} from "@/components/EvIcon";
import {Cancel} from "@/icons";
import {useLocaleFunctions} from "@/composables/locale.ts";

const props = defineProps(makeEvTagProps());
const {t} = useLocaleFunctions();

</script>
<template>
    <div class="ev-tag">
        <div class="ev-tag--content">Tag</div>

        <button
            v-if="props.closable"
            class="ev-tag--close"
            :aria-label="t('close')"
        >
            <ev-icon :glyph="Cancel" size="small" />
        </button>
    </div>
</template>
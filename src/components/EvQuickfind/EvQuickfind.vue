<script setup lang="ts">
import './EvQuickfind.scss';
import EvIcon from "../EvIcon/EvIcon.vue";
import {Quickfind} from "../../icons";
import {useModelProxy} from "@/composables/modelProxy.ts";
import {sizeModifier} from "@/util";
import {computed} from "vue";

type QuickfindSize = 'small' | 'medium' | 'large';

interface QuickfindProps {
    modelValue?: string|number,
    bold?: boolean,
    size?: QuickfindSize
}
const props = withDefaults(defineProps<QuickfindProps>(), {
    bold: false,
    size: 'medium'
});
const modelProxy = useModelProxy(props, 'modelValue');

const iconSize = computed(() => {
    switch (props.size) {
        case 'small':
        case 'medium':
            return 'small';
        default:
            return 'medium';
    }
});

</script>
<template>
    <span class="ev-quickfind"
          :class="[
              {
                  'is-variant-bold': bold
              },
              sizeModifier(size, ['medium'])
          ]"
    >
        <ev-icon :glyph="Quickfind" :size="iconSize" />
        <span class="ev-quickfind--code">{{ modelProxy }}</span>
    </span>
</template>
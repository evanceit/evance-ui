<script setup lang="ts">
import './EvQuickfind.scss';
import EvIcon from "../EvIcon/EvIcon.vue";
import {Quickfind} from "../../icons";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {sizeModifier} from "../../util";

type QuickfindSize = 'small' | 'medium' | 'large';

interface QuickfindProps {
    modelValue?: string,
    bold?: boolean,
    size?: QuickfindSize
}
const props = withDefaults(defineProps<QuickfindProps>(), {
    bold: false,
    size: 'medium'
});
const modelProxy = useModelProxy(props, 'modelValue');

</script>
<template>
    <span class="ev-quickfind"
          :class="[
              {
                  'is-bold': bold
              },
              sizeModifier(size, ['medium'])
          ]"
    >
        <ev-icon :glyph="Quickfind" :size="size" />
        <span class="ev-quickfind--code">{{ modelProxy }}</span>
    </span>
</template>
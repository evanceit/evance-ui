<script setup lang="ts">
import "./EvLink.scss";
import { makeEvLinkProps } from "./EvLink";
import { computed, useAttrs } from "vue";
import {
    RouterLinkOrHrefProps,
    useRouterLinkOrHref,
} from "@/composables/router.ts";
import { appearanceModifier } from "@/util";
import { useDefaults } from "@/composables";
import { EvIcon } from "@/components/EvIcon";
import { LinkExternalIcon } from "@/icons/editor";

const definedProps = defineProps({ ...makeEvLinkProps() });
const props = useDefaults(definedProps);

const attrs = useAttrs();
const slots = defineSlots<{
    default(): never;
}>();
const link = useRouterLinkOrHref(props as RouterLinkOrHrefProps, attrs);

const appearanceClass = computed(() => appearanceModifier(props.appearance));

const iconEnd = computed(() => {
    if (attrs.target === "_blank" && !props.iconEnd) {
        return LinkExternalIcon;
    }
    return props.iconEnd;
});
</script>

<template>
    <a
        :class="[
            'ev-link',
            {
                'is-disabled': props.disabled,
            },
            appearanceClass,
            props.class,
        ]"
        :style="props.style"
        :href="link.href.value">
        <ev-icon
            v-if="props.iconStart"
            :glyph="props.iconStart"
            class="ev-link--icon-start" />
        <slot>{{ props.text }}</slot>
        <ev-icon v-if="iconEnd" :glyph="iconEnd" class="ev-link--icon-end" />
    </a>
</template>

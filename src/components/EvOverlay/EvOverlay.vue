<script setup lang="ts">
/**
 * # EvOverlay
 */
import "./EvOverlay.scss";
import { makeEvOverlayProps } from "./EvOverlay.ts";
import { useModelProxy } from "@/composables/modelProxy.ts";
import {
    computed,
    mergeProps,
    ref,
    shallowRef,
    toRef,
    useAttrs,
    watch,
} from "vue";
import { useTeleport } from "@/composables/teleport.ts";
import { useEvTransition, EvTransition } from "@/components/EvTransition";
import { useDimensions } from "@/composables/dimensions.ts";
import { clickBlockedAnimation, getScrollParent, toWebUnit } from "@/util";
import { useStack } from "@/composables/stack.ts";
import { useRouter } from "vue-router";
import { useToggleScope } from "@/composables/toggleScope.ts";
import { useBackButton } from "@/composables/router.ts";
import { ActivatorProps, useActivator } from "./activator.ts";
import { useScopeId } from "@/composables/scopeId.ts";
import { usePositionStrategies } from "./position.ts";
import { useScrollStrategies } from "./scroll.ts";
import { useRtl } from "@/composables/locale.ts";

defineOptions({
    inheritAttrs: false,
});

// Emit
const emit = defineEmits(["click:outside", "update:modelValue", "afterLeave"]);

const props = defineProps({
    disableGlobalStack: Boolean,
    ...makeEvOverlayProps(),
});
const attrs = useAttrs();
const slots = defineSlots<{
    activator(props: { isActive: boolean; props: any }): any;
    default(): never;
}>();
const router = useRouter();
const model = useModelProxy(props, "modelValue");
const containerEl = ref<HTMLElement | undefined>(undefined);
const contentEl = ref<HTMLElement | undefined>(undefined);
const contentTransition = useEvTransition(props);
const dimensions = useDimensions(props);
const { scopeId } = useScopeId();
const isActiveContent = computed({
    get: () => model.value,
    set: (value) => {
        if (!(value && props.disabled)) {
            model.value = value;
        }
    },
});
const { isTopGlobal, isTopLocal, stackStyles } = useStack(
    isActiveContent,
    toRef(props, "zIndex"),
    props.disableGlobalStack,
);
const {
    activatorEl,
    activatorRef,
    activatorEvents,
    contentEvents,
    veilEvents,
} = useActivator(props as ActivatorProps, isActiveContent, isTopLocal);
const teleportTarget = useTeleport(
    computed(() => {
        return props.attach || props.contained;
    }),
);
const { rtlClasses, isRtl } = useRtl();

const { contentStyles, updatePosition } = usePositionStrategies(props, {
    isRtl,
    contentEl,
    activatorEl,
    isActive: isActiveContent,
});

useScrollStrategies(props, {
    containerEl,
    contentEl,
    activatorEl,
    isActive: isActiveContent,
    updatePosition,
});

/**
 * What should parent components have access to?
 */
defineExpose({
    activatorEl,
    contentEl,
    isTopGlobal,
    isTopLocal,
    updatePosition,
});

/**
 * When disabled update the model value via the isActive computed prop
 */
watch(
    () => props.disabled,
    (value) => {
        if (value) {
            isActiveContent.value = false;
        }
    },
);

/**
 * The veil transitions into view at the same time as the content,
 * but only if it is enabled by `props.veil`.
 */
const isActiveVeil = computed(() => {
    return isActiveContent.value && !!props.veil;
});

/**
 * `isActive` relates to the content of the overlay.
 * To have nice transitions we need to track active containment.
 * `isActiveTeleport` follows `isActive`, which means it activates at the same time,
 * but only disables when the content is removed by the transition (@after-leave).
 * @see onAfterLeave
 */
const isActiveTeleport = shallowRef(false);
watch(isActiveContent, () => {
    isActiveTeleport.value = true;
});

/**
 * ## Click Outside Condition
 * Allows or denies the click outside event to trigger.
 */
function clickOutsideCondition(): boolean {
    return isActiveContent.value && isTopGlobal.value;
}

/**
 * ## Dismiss
 * @param focusActivator
 */
function dismiss(focusActivator: boolean = false) {
    if (props.persistent) {
        // Let's let the user know they can't dismiss the overlay this way
        // @todo: option to prevent shake
        clickBlockedAnimation(contentEl.value);
        return;
    }
    isActiveContent.value = false;
    if (focusActivator && contentEl.value?.contains(document.activeElement)) {
        activatorEl.value?.focus();
    }
}

/**
 * Event Listeners
 */
function onAfterLeave() {
    isActiveTeleport.value = false;
    emit("afterLeave");
}

const clickOutsideDirectiveArgs = {
    handler: onClickOutside,
    condition: clickOutsideCondition,
    include: () => [activatorEl.value],
};

function onClickOutside(e: MouseEvent) {
    emit("click:outside", e);
    dismiss(false);
}

function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && isTopGlobal.value) {
        dismiss(true);
    }
}
// Listen for keydown events only when the content is active
watch(
    isActiveContent,
    (active) => {
        if (active) {
            window.addEventListener("keydown", onKeydown);
        } else {
            window.removeEventListener("keydown", onKeydown);
        }
    },
    { immediate: true },
);

/**
 * Integrate with Back button for single page apps.
 */
useToggleScope(
    () => props.closeOnBack,
    () => {
        useBackButton(router, (next) => {
            if (isTopGlobal.value && isActiveContent.value) {
                next(false);
                dismiss(false);
            } else {
                next();
            }
        });
    },
);

/**
 * Calculate the `top` position
 */
const top = ref<number>();
watch(
    () =>
        isActiveContent.value &&
        (props.absolute || props.contained) &&
        teleportTarget.value == null,
    (value) => {
        if (value) {
            const scrollParent = getScrollParent(containerEl.value);
            if (scrollParent && scrollParent !== document.scrollingElement) {
                top.value = scrollParent.scrollTop;
            }
        }
    },
);

/**
 * Dynamically create a local component we can render using:
 * `<activator-slot>` or `<component :is="activatorSlot" />`
 */
const activatorSlot = () => {
    return slots.activator?.({
        isActive: isActiveContent.value,
        props: mergeProps(
            { ref: activatorRef },
            activatorEvents.value,
            props.activatorProps,
        ),
    });
};

const contentAttributes = mergeProps(contentEvents.value, props.contentProps);
const overlayAttributes = {
    ...scopeId,
    ...attrs,
};
</script>

<template>
    <activator-slot />

    <teleport
        v-if="isActiveTeleport"
        :disabled="!teleportTarget"
        :to="teleportTarget">
        <div
            ref="containerEl"
            :class="[
                'ev-overlay',
                {
                    'is-active': isActiveContent,
                },
                rtlClasses,
                props.class,
            ]"
            :style="[
                stackStyles,
                {
                    top: toWebUnit(top),
                },
                props.style,
            ]"
            v-bind="overlayAttributes">
            <transition appear name="transition-fade">
                <div
                    v-if="isActiveVeil"
                    class="ev-overlay--veil"
                    v-bind="veilEvents"></div>
            </transition>

            <ev-transition
                appear
                :transition="contentTransition"
                :target="activatorEl"
                @after-leave="onAfterLeave">
                <div
                    v-show="isActiveContent"
                    ref="contentEl"
                    v-click-outside="clickOutsideDirectiveArgs"
                    class="ev-overlay--content"
                    :class="[props.contentClass]"
                    :style="[dimensions, contentStyles]"
                    v-bind="contentAttributes">
                    <slot />
                </div>
            </ev-transition>
        </div>
    </teleport>
</template>

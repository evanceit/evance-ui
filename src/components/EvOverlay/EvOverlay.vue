<script setup lang="ts">
/**
 * # EvOverlay
 */
import './EvOverlay.scss';
import {makeEvOverlayProps} from "./EvOverlay.ts";
import {useModelProxy} from "../../composables/modelProxy.ts";
import {computed, ref, shallowRef, watch} from "vue";
import {useTeleport} from "../../composables/teleport.ts";
import {useTransition} from "../../composables/transitions.ts";
import {useDimensions} from "../../composables/dimensions.ts";

defineOptions({
    inheritAttrs: false
});

// Emit
const emit = defineEmits([
    'click:outside',
    'update:modelValue'
]);

const props = defineProps(makeEvOverlayProps());
const model = useModelProxy(props, 'modelValue');
const container = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const contentTransition = useTransition(props);
const dimensions = useDimensions(props);
const isActiveContent = computed({
    get: () => model.value,
    set: (value) => {
        if (!(value && props.disabled)) {
            model.value = value;
        }
    }
});
const teleportTarget = useTeleport(computed(() => {
    return props.attach || props.contained;
}));

/**
 * When disabled update the model value via the isActive computed prop
 */
watch(() => props.disabled, (value) => {
    if (value) {
        isActiveContent.value = false;
    }
});

/**
 * The veil transitions into view at the same time as the content,
 * but only if it is enabled by `props.veil`.
 */
const isActiveVeil = computed(() => {
    return (isActiveContent.value && !!props.veil);
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
 * ## Dismiss
 * @param focusActivator
 */
function dismiss(focusActivator: boolean = false) {
    if (props.persistent) {
        // Let's let the user know they can't dismiss the overlay this way
        // @todo: animate content shake
        return;
    }
    isActiveContent.value = false;
    if (focusActivator && content.value?.contains(document.activeElement)) {
        // @todo: focus on the original activator
    }
}

// Listeners
function onAfterLeave(e) {
    isActiveTeleport.value = false;
}

function onClickOutside(e: MouseEvent) {
    emit('click:outside', e);
    dismiss(false);
}

function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Escape') {
        return;
    }
    dismiss(true);
}

watch(isActiveContent, (active) => {
    if (active) {
        window.addEventListener('keydown', onKeydown);
    } else {
        window.removeEventListener('keydown', onKeydown);
    }
}, { immediate: true });

</script>
<template>
    <teleport
        v-if="isActiveTeleport"
        :disabled="!teleportTarget"
        :to="teleportTarget">
        <div
            ref="container"
            class="ev-overlay"
            :class="[
                {
                    'is-active': isActiveContent
                }
            ]"
        >
            <transition appear
                        name="transition-fade">
                <div v-if="isActiveVeil" class="ev-overlay--veil"></div>
            </transition>

            <transition appear
                        v-bind="contentTransition"
                        @after-leave="onAfterLeave">
                <div
                    ref="content"
                    class="ev-overlay--content"
                    :style="[
                        dimensions
                    ]"
                    v-show="isActiveContent"
                    v-click-outside="onClickOutside"
                >
                    <slot />
                </div>
            </transition>

        </div>
    </teleport>
</template>
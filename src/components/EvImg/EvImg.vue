<script setup lang="ts">
/**
 * `<ev-img>`
 */
import "./EvImg.scss";
import { makeEvImgProps, EvImgSrcObject } from "./EvImg";
import { EvResponsive } from "@/components/EvResponsive";
import { EvTransition, useEvTransition } from "@/components/EvTransition";
import {
    computed,
    ComputedRef,
    nextTick,
    onBeforeMount,
    onBeforeUnmount,
    onMounted,
    ref,
    shallowRef,
    watch,
} from "vue";
import {Browser, filterComponentProps, isObject, makeClassName, toWebUnit} from "@/util";

const props = defineProps({
    ...makeEvImgProps(),
});
const slots = defineSlots<{
    default(): never;
    error(): never;
    loading(): never;
    placeholder(): never;
    sources(): never;
}>();
const emit = defineEmits(["loadstart", "load", "error"]);

const currentSrc = shallowRef("");
const image = ref<HTMLImageElement>();
const state = shallowRef<"idle" | "loading" | "loaded" | "error">(
    props.eager ? "loading" : "idle",
);
const naturalWidth = shallowRef<number>();
const naturalHeight = shallowRef<number>();
const transition = useEvTransition(props);

const normalisedSrc: ComputedRef<EvImgSrcObject> = computed(() => {
    const imgSrc = props as EvImgSrcObject | { src: EvImgSrcObject };

    return isObject(imgSrc.src)
        ? {
              src: imgSrc.src.src,
              srcset: props.srcset || imgSrc.src.srcset,
              lazySrc: props.lazySrc || imgSrc.src.lazySrc,
              aspect: props.aspectRatio || imgSrc.src.aspect || 0,
          }
        : {
              src: props.src,
              srcset: props.srcset,
              lazySrc: props.lazySrc,
              aspect: props.aspectRatio || 0,
          };
});

const aspectRatio = computed(() => {
    return (
        normalisedSrc.value.aspect ||
        naturalWidth.value! / naturalHeight.value! ||
        0
    );
});

const objectFitClasses = computed(() => {
    return {
        "is-object-cover": props.cover,
        "is-object-contain": !props.cover,
    };
});

/**
 * ## getSrc
 */
function getSrc() {
    const img = image.value;
    if (img) {
        currentSrc.value = img.currentSrc || img.src;
    }
}

/**
 * ## init
 *
 * @param isIntersecting
 */
function init(isIntersecting?: boolean) {
    if (props.eager && isIntersecting) {
        return;
    }
    if (Browser.supportsIntersection && !isIntersecting && !props.eager) {
        return;
    }
    state.value = "loading";

    if (normalisedSrc.value.lazySrc) {
        const lazyImg = new Image();
        lazyImg.src = normalisedSrc.value.lazySrc;
        pollForSize(lazyImg, null);
    }

    if (!normalisedSrc.value.src) {
        return;
    }

    nextTick(() => {
        emit("loadstart", image.value?.currentSrc || normalisedSrc.value.src);
        setTimeout(() => {
            if (image.value?.complete) {
                if (!image.value.naturalWidth) {
                    onError();
                }
                if (state.value === "error") {
                    return;
                }
                if (!aspectRatio.value) {
                    pollForSize(image.value, null);
                }
                if (state.value === "loading") {
                    onLoad();
                }
            } else {
                if (!aspectRatio.value) {
                    pollForSize(image.value!);
                }
                getSrc();
            }
        });
    });
}

/**
 * ## onError
 */
function onError() {
    state.value = "error";
    emit("error", image.value?.currentSrc || normalisedSrc.value.src);
}

/**
 * ## onLoad
 */
function onLoad() {
    getSrc();
    pollForSize(image.value!);
    state.value = "loaded";
    emit("load", image.value?.currentSrc || normalisedSrc.value.src);
}

let timer = -1;
function pollForSize(img: HTMLImageElement, timeout: number | null = 100) {
    const poll = () => {
        clearTimeout(timer);
        if (!img) {
            return;
        }
        if (!img?.complete && state.value === "loading" && timeout != null) {
            timer = window.setTimeout(poll, timeout);
            return;
        }
        const { naturalHeight: imgHeight, naturalWidth: imgWidth } = img;
        if (imgHeight || imgWidth) {
            naturalWidth.value = imgWidth;
            naturalHeight.value = imgHeight;
        } else if (
            img.currentSrc.endsWith(".svg") ||
            img.currentSrc.startsWith("data:image/svg+xml")
        ) {
            naturalWidth.value = 1;
            naturalHeight.value = 1;
        }
    };
    poll();
}

watch(
    () => props.src,
    () => {
        if (state.value !== "idle") {
            state.value = "idle";
            nextTick(() => {
                init(true);
            });
        }
    },
);

watch(aspectRatio, (val, oldVal) => {
    if (!val && oldVal && image.value) {
        pollForSize(image.value);
    }
});

onBeforeMount(() => init());

if (Browser.hasWindow) {
    const windowWidth = ref(window.innerWidth);
    const onWindowResize = () => {
        windowWidth.value = window.innerWidth;
    };
    onMounted(() => {
        window.addEventListener("resize", onWindowResize);
        onWindowResize();
    });

    onBeforeUnmount(() => {
        window.removeEventListener("resize", onWindowResize);
    });

    watch(windowWidth, (newWidth, oldWidth) => {
        if (newWidth != oldWidth) {
            getSrc();
        }
    });
}

const isBooted = shallowRef(false);
{
    const stop = watch(aspectRatio, (val) => {
        if (val) {
            // Doesn't work with nextTick, idk why
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    isBooted.value = true;
                });
            });
            stop();
        }
    });
}

const isLoaded = computed(() => {
    return state.value === "loaded";
});

const isEmpty = computed(() => {
    return !normalisedSrc.value.src && !normalisedSrc.value.lazySrc;
});

const responsiveProps = computed(() =>
    filterComponentProps(EvResponsive, props),
);

const imgProps = computed(() => ({
    src: normalisedSrc.value.src,
    srcset: normalisedSrc.value.srcset,
    alt: props.alt,
    crossorigin: props.crossorigin,
    referrerpolicy: props.referrerpolicy,
    draggable: props.draggable,
    sizes: props.sizes,
}));

const stateClass = computed(() => makeClassName(state.value, "is-state"));
</script>

<template>
    <ev-responsive
        v-intersect.once="{
            handler: init,
            options: props.options,
        }"
        :class="[
            'ev-img',
            {
                'is-booting': !isBooted,
            },
            stateClass,
            props.class,
        ]"
        :style="[
            {
                width: toWebUnit(
                    props.width === 'auto' ? naturalWidth : props.width,
                ),
            },
            props.style,
        ]"
        v-bind="responsiveProps"
        :aria-label="props.alt"
        :aspect-ratio="aspectRatio"
        :role="props.alt ? 'img' : undefined">
        <template #additional>
            <ev-transition
                v-if="normalisedSrc.src && state !== 'idle'"
                :transition="transition"
                appear>
                <picture
                    v-if="slots.sources"
                    v-show="isLoaded"
                    class="ev-img--picture">
                    <slot name="sources" />
                    <img
                        ref="image"
                        :class="['ev-img--img', objectFitClasses]"
                        :style="{ objectPosition: props.position }"
                        v-bind="imgProps"
                        @load="onLoad"
                        @error="onError" />
                </picture>
                <img
                    v-else
                    v-show="isLoaded"
                    ref="image"
                    :class="['ev-img--img', objectFitClasses]"
                    :style="{ objectPosition: props.position }"
                    v-bind="imgProps"
                    @load="onLoad"
                    @error="onError" />
            </ev-transition>

            <ev-transition
                v-if="normalisedSrc.lazySrc && state !== 'loaded'"
                :transition="transition">
                <img
                    :class="[
                        'ev-img--img',
                        'ev-img--preload',
                        objectFitClasses,
                    ]"
                    :style="{ objectPosition: props.position }"
                    :src="normalisedSrc.lazySrc"
                    :alt="props.alt"
                    :crossorigin="props.crossorigin"
                    :referrerpolicy="props.referrerpolicy"
                    :draggable="props.draggable" />
            </ev-transition>

            <div
                v-if="props.gradient"
                class="ev-img--gradient"
                :style="{
                    backgroundImage: `linear-gradient(${props.gradient})`,
                }"></div>

            <ev-transition
                v-if="slots.placeholder && isEmpty"
                :transition="transition"
                appear>
                <div class="ev-img--placeholder">
                    <slot name="placeholder" />
                </div>
            </ev-transition>
            <ev-transition
                v-else-if="slots.loading && state === 'loading'"
                :transition="transition"
                appear>
                <div class="ev-img--loading">
                    <slot name="loading" />
                </div>
            </ev-transition>
            <ev-transition
                v-else-if="slots.error && state === 'error'"
                :transition="transition"
                appear>
                <div class="ev-img--error">
                    <slot name="error" />
                </div>
            </ev-transition>
        </template>
        <template v-if="slots.default" #default>
            <slot name="default" />
        </template>
    </ev-responsive>
</template>

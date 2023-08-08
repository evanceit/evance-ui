// Utilities
import {shallowRef, toRaw, watch} from 'vue'

// Types
import type { Ref } from 'vue'
import {EvList} from "../EvList";
import {EvTextfield} from "../EvTextfield";


/**
 * # Use Scrolling
 *
 * @param listRef
 * @param textFieldRef
 */
export function useScrolling (listRef: Ref<EvList | undefined>, textFieldRef: Ref<EvTextfield | undefined>) {
    const isScrolling = shallowRef(false);
    let scrollTimeout: number;

    function onListScroll (e: Event) {
        cancelAnimationFrame(scrollTimeout);
        isScrolling.value = true;
        scrollTimeout = requestAnimationFrame(() => {
            scrollTimeout = requestAnimationFrame(() => {
                isScrolling.value = false;
            });
        });
    }

    async function finishScrolling () {
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise<void>(resolve => {
            if (isScrolling.value) {
                const stop = watch(isScrolling, () => {
                    stop();
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    async function onListKeydown (e: KeyboardEvent) {
        if (e.key === 'Tab') {
            textFieldRef.value?.focus();
            return;
        }

        if (!['PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) {
            return;
        }
        const el: HTMLElement = listRef.value?.$el;
        if (!el) {
            return;
        }

        if (e.key === 'Home' || e.key === 'End') {
            el.scrollTo({
                top: e.key === 'Home' ? 0 : el.scrollHeight,
                behavior: 'smooth'
            });
        }

        await finishScrolling();

        const children = el.querySelectorAll(':scope > :not(.ev-virtual-scroll--spacer)');

        if (e.key === 'PageDown' || e.key === 'Home') {
            const top = el.getBoundingClientRect().top;
            for (const child of children) {
                if (child.getBoundingClientRect().top >= top) {
                    (child as HTMLElement).focus();
                    break;
                }
            }
        } else {
            const bottom = el.getBoundingClientRect().bottom;
            for (const child of [...children].reverse()) {
                if (child.getBoundingClientRect().bottom <= bottom) {
                    (child as HTMLElement).focus();
                    break;
                }
            }
        }
    }

    return {
        onListScroll,
        onListKeydown
    };
}
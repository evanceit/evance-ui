/**
 * # Toggle Scope Utility
 *
 * Manage an effect scope based on changes in a watched source.
 *
 * We use effectScope() to capture the reactive effects of reactive/computed property.
 * @see https://vuejs.org/api/reactivity-advanced.html#effectscope
 */
// Utilities
import { effectScope, onScopeDispose, watch } from 'vue'

// Types
import type { EffectScope, WatchSource } from 'vue'

export function useToggleScope(
    source: WatchSource<boolean>,
    fn: (reset: () => void) => void
): void {

    let scope: EffectScope | undefined;

    function start(): void {
        scope = effectScope();
        scope.run(() => {
                return fn.length ? fn(() => { scope?.stop(); start(); }) : (fn as any)();
            }
        );
    }

    function watchCallback(active: boolean): void {
        if (active && !scope) {
            start();
        } else if (!active) {
            scope?.stop();
            scope = undefined;
        }
    }

    const watchOptions = {
        immediate: true
    };

    watch(source, watchCallback, watchOptions);

    onScopeDispose(() => {
        scope?.stop();
    });
}
import {NavigationGuardNext, RouteLocationRaw, Router, RouterLink, useLink, UseLinkOptions} from "vue-router";
import {
    computed,
    ComputedRef, nextTick, onScopeDispose, PropType,
    Ref,
    resolveDynamicComponent,
    SetupContext,
    toRef
} from "vue";
import {Browser, ClickEventListeners, hasEventListener, isString, propsFactory} from "../util";


/**
 * # RouterLink or Href Props
 *
 * We need to be able to accommodate `<a href="">` links
 * as well as `<router-link to="...">` links.
 *
 * This is an important distinction in Evance since we use both.
 *
 */
export interface RouterLinkOrHrefProps {
    href: string | undefined;
    replace: boolean | undefined;
    to: RouteLocationRaw | undefined;
    exact: boolean | undefined;
}


/**
 * # Use RouterLink or Href
 */
export interface UseRouterLinkOrHref extends Omit<Partial<ReturnType<typeof useLink>>, 'href'> {
    isLink: ComputedRef<boolean>
    isClickable: ComputedRef<boolean>
    href: Ref<string | undefined>
}


/**
 * # Is Clickable Link
 * @param props
 * @param attrs
 */
export function isClickableLink(
    props: RouterLinkOrHrefProps & ClickEventListeners,
    attrs: SetupContext['attrs']
): ComputedRef<boolean> {
    return computed(() => {
        return (
            !!(props.href || props.to)
            || hasEventListener(attrs, 'click')
            || hasEventListener(props, 'click')
        );
    });
}


/**
 * # Is RouterLink or Href
 * @param props
 */
export function isRouterLinkOrHref(props: RouterLinkOrHrefProps): ComputedRef<boolean> {
    return computed(() => {
        return !!(props.href || props.to);
    });
}


/**
 * # Make Router Props
 */
export const makeRouterLinkOrHrefProps = propsFactory({
    href: String,
    replace: Boolean,
    to: [String, Object] as PropType<RouteLocationRaw>,
    exact: Boolean,
}, 'router');


/**
 * # Use Router Link or Href
 *
 * This is heavily "inspired" by Vuetify.
 * https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/composables/router.tsx
 *
 * @param props
 * @param attrs
 */
export function useRouterLinkOrHref(
    props: RouterLinkOrHrefProps & ClickEventListeners,
    attrs: SetupContext['attrs']
): UseRouterLinkOrHref {
    const routerLink = resolveDynamicComponent('RouterLink') as typeof RouterLink | string;
    const isLink = isRouterLinkOrHref(props);
    const isClickable = isClickableLink(props, attrs);
    if (isString(routerLink)) {
        return {
            isLink,
            isClickable,
            href: toRef(props, 'href')
        };
    }
    const link = props.to ? routerLink.useLink(props as UseLinkOptions) : undefined;
    return {
        isLink,
        isClickable,
        route: link?.route,
        navigate: link?.navigate,
        isActive: link && computed(() => props.exact ? link.isExactActive?.value : link.isActive?.value),
        isExactActive: link?.isExactActive,
        href: computed(() => props.to ? link?.route.value.href : props.href)
    };
}

/**
 * # Use Back Button
 *
 * Listen to PopStateEvents dispatched to the window every time the
 * active history entry changes between two history entries for the same document.
 *
 * We need this for navigation on single page apps.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PopStateEvent
 */
let isTransitioning = false;
export function useBackButton(
    router: Router | undefined,
    callback: (next: NavigationGuardNext) => void
) {
    let isPopped = false;
    let removeBefore: (() => void) | undefined;
    let removeAfter: (() => void) | undefined;

    function onPopState (e: PopStateEvent) {
        if (e.state?.replaced) {
            return;
        }
        isPopped = true;
        // Use setTimeout to be asynchronous
        setTimeout(() => (isPopped = false));
    }

    if (Browser.hasWindow) {

        nextTick(() => {
            window.addEventListener('popstate', onPopState);
            removeBefore = router?.beforeEach((to, from, next) => {
                if (!isTransitioning) {
                    // Use setTimeout to be asynchronous
                    setTimeout(() => {
                        return isPopped ? callback(next) : next();
                    });
                } else {
                    isPopped ? callback(next) : next();
                }
                isTransitioning = true;
            });
            removeAfter = router?.afterEach(() => {
                isTransitioning = false;
            });
        });

        onScopeDispose(() => {
            window.removeEventListener('popstate', onPopState);
            removeBefore?.();
            removeAfter?.();
        });
    }
}
import {ComponentInternalInstance} from "vue";
import {getCurrentComponent} from "../util";

/**
 * # Get Next ID
 */
let currentId: number = 0;
let assignedIds = new WeakMap<ComponentInternalInstance, number>();
export function getNextId(): number {
    const component = getCurrentComponent('getNextId()');
    if (assignedIds.has(component)) {
        return assignedIds.get(component);
    }
    const id = ++currentId;
    assignedIds.set(component, id);
    return id;
}
getNextId.reset = () => {
    currentId = 0;
    assignedIds = new WeakMap();
}


/**
 * # Split Object
 *
 * Split an object into two using an Array of keys or RegExp to test keys against.
 *
 * This results an array containing an object containing only matching keys,
 * and an object containing the remaining keys.
 *
 * @param subject
 * @param paths
 */
export function splitObject<
    Subject extends object,
    SubjectKey extends Extract<keyof Subject, string>
> (subject: Subject, paths: (SubjectKey | RegExp)[]): [matched: Partial<Subject>, unmatched: Partial<Subject>] {
    const matching = Object.create(null);
    const remaining = Object.create(null);
    for (const key in subject) {
        if (paths.some(path => (path instanceof RegExp) ? path.test(key) : path === key)) {
            matching[key] = subject[key];
        } else {
            remaining[key] = subject[key];
        }
    }
    return [ matching, remaining ];
}


/**
 * ## Split Input Attrs
 *
 * Filter/split an attributes objects into two objects:
 * 1. Attributes not intended for an input field.
 * 2. Attributes for an input field.
 *
 * @param attrs
 */
export function splitInputAttrs(attrs: Record<string, unknown>) {
    return splitObject(attrs, ['class', 'style', 'id', /^data-/]);
}
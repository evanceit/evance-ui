import {
    ComponentInternalInstance,
    ComponentPublicInstance,
    computed,
    ComputedGetter,
    reactive, toRefs,
    ToRefs,
    watchEffect
} from "vue";
import {getCurrentComponent, isArray, isFunction, isString} from "../util";


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
 * # Getter Property Key
 *
 * Defines where to look for Property information within getter functions.
 *
 * For example: an object might have a `title` property.
 * So a property key may represent either an array index, or an object property.
 *
 * - `boolean` - Ignored
 * - `string` - Property name, or use Object path notation.
 * - `array` of strings or numbers represent nested lookup - each array element represents a key in the hierarchy
 */
export type GetterPropertyKey =
    | boolean
    | string
    | (string | number)[]
    | ((item: Record<string, any>, fallback?: any) => any);


/**
 * # Get Property
 *
 * A getter function, which gets a property from the `subject`, which may be
 * any kind of object.
 *
 */
export function getPropertyValue(
    subject: any,
    property: GetterPropertyKey,
    fallback?: any
): any {
    if (property == null) {
        return (subject === undefined) ? fallback : subject;
    }
    if (subject !== Object(subject) || isFunction(property)) {
        if (!isFunction(property)) {
            return fallback;
        }
        const value = property(subject, fallback);
        return (typeof value === undefined) ? fallback : value;
    }
    if (isString(property)) {
        return getPropertyFromPath(subject, property, fallback);
    }
    if (isArray(property)) {
        return getNestedPropertyValue(subject, property, fallback);
    }
    throw new Error("Can't tell how to getProperty() from subject");
}


/**
 * # Get Property from Path
 *
 * This is a rough copy of Evance's `EvObjectPathGetter` functionality.
 *
 * @param subject
 * @param objectPath
 * @param fallback
 */
export function getPropertyFromPath(subject: any, objectPath: string, fallback?: any) {
    if (subject == null || !objectPath) {
        return fallback;
    }
    const propertyKeys = objectPathToPropertyKeys(objectPath);
    return getNestedPropertyValue(subject, propertyKeys, fallback);
}


/**
 * # Get Nested Property Value
 *
 * @param subject
 * @param propertyKeys
 * @param fallback
 */
export function getNestedPropertyValue(subject: any, propertyKeys: PropertyKey[], fallback?: any): any {
    let lastValue = subject;
    for (const property of propertyKeys) {
        if (lastValue === undefined) {
            break;
        }
        lastValue = lastValue[property];
    }
    return (lastValue === undefined) ? fallback : lastValue;
}


/**
 * # Object Path To Array
 *
 * This is a rough copy of Evance's `EvObjectPath` functionality.
 *
 * @param path
 */
export function objectPathToPropertyKeys(path: string): PropertyKey[] {
    const pattern = /^([\da-z_-]+)(?:[\/.]([\da-z_-]+)|\[(\d+)\])*$/i;
    const matches = path.match(pattern);
    if (!matches) {
        throw new Error('Invalid Object Path');
    }
    path = path.replace(']', '')
        .replace('[', '.')
        .replace('/', '.');
    return path.split('.');
}


/**
 * # Ref Element
 * @param obj
 */
export function refElement<T extends object | undefined> (obj: T): Exclude<T, ComponentPublicInstance> | HTMLElement {
    return obj && '$el' in obj
        ? obj.$el as HTMLElement
        : obj as HTMLElement;
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


/**
 * # Destruct Computed
 *
 * Convert a computed ref to a record of refs.
 * The getter function must always return an object with the same keys.
 */
export function destructComputed<T extends object> (getter: ComputedGetter<T & NotAUnion<T>>): ToRefs<T>;
export function destructComputed<T extends object> (getter: ComputedGetter<T>) {
    const refs = reactive({}) as T;
    const base = computed(getter);
    watchEffect(() => {
        for (const key in base.value) {
            refs[key] = base.value[key];
        }
    }, { flush: 'sync' });
    return toRefs(refs);
}


export function clamp (value: number, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value))
}

/**
 * # Union To Intersection
 *
 * Intersection `I` of all types in the union `U` - transform a union of object types into an intersection of those types.
 * This can be helpful when you want to combine multiple types into a single type, where all properties from each type
 * become part of the resulting type.
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;


/**
 * # Get Descriptor
 *
 * Returns the closest property descriptor for an object.
 *
 * @param obj
 * @param key
 */
export function getPropertyDescriptor(obj: any, key: PropertyKey) {
    let currentObj = obj;
    while (currentObj) {
        const descriptor = Reflect.getOwnPropertyDescriptor(currentObj, key);
        if (descriptor) {
            return descriptor;
        }
        currentObj = Object.getPrototypeOf(currentObj);
    }
    return undefined;
}
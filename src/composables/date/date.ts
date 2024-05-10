import { inject, InjectionKey, reactive, watch } from "vue";
import { DateAdapter } from "@/composables/date/DateAdapter.ts";
import { LocaleManager } from "@/modules/Locale/LocaleManager.ts";
import { isFunction, mergeDeep } from "@/util";
import { DefaultDateAdapter } from "@/composables/date/DefaultDateAdapter.ts";

/**
 * # Date Adapter Instance
 */
export interface DateAdapterInstance<
    T = DateAdapterInstanceType["instanceType"],
> extends DateAdapter<T> {
    locale?: any;
}

/**
 * # Date Adapter Instance Type
 * Supports module augmentation to specify date object types
 */
export interface DateAdapterInstanceType {
    instanceType: unknown;
}

export const DateAdapterSymbol: InjectionKey<DateAdapterInstance> =
    Symbol.for("ev:date-adapter");

export type InternalDateOptions<T = unknown> = {
    adapter:
        | (new (options: {
              locale: any;
              formats?: any;
          }) => DateAdapterInstance<T>)
        | DateAdapterInstance<T>;
    formats?: Record<string, any>;
    locale: Record<string, any>;
};

export type DateOptions<T = any> = Partial<InternalDateOptions<T>>;

/**
 * # Create Date
 *
 * @param options
 * @param locale
 */
export function createDate(
    options: DateOptions | undefined,
    locale: LocaleManager,
) {
    const date = mergeDeep(
        {
            adapter: DefaultDateAdapter,
        },
        options,
    ) as InternalDateOptions;

    const instance = reactive(
        isFunction(date.adapter)
            ? new date.adapter({
                  locale: locale.currentLocale.value,
                  formats: date.formats,
              })
            : date.adapter,
    );

    watch(locale.currentLocale, (value) => {
        instance.locale = value;
    });

    return instance;
}

/**
 * # Use Date
 */
export function useDate() {
    const instance = inject(DateAdapterSymbol);
    if (!instance) {
        throw new Error("Evance UI: Unable to find injected date adapter.");
    }
    return instance;
}

import { propsFactory } from "@/util";
import { DefaultsOptions } from "@/composables/defaults.ts";
import { PropType } from "vue";

export const makeEvDefaultsProviderProps = propsFactory(
    {
        defaults: Object as PropType<DefaultsOptions>,
        disabled: Boolean,
        reset: [Number, String],
        root: [Boolean, String],
        scoped: Boolean,
    },
    "EvDefaultsProvider",
);

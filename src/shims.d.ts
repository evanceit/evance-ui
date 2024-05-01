
import {UnwrapNestedRefs, VNodeChild} from "vue";

// @skip-build
import {
    DefaultsInstance,
    DisplayInstance,
    DateAdapterInstance
} from "./framework";
import {LocaleManager} from "@/modules/Locale/LocaleManager.ts";


declare module '@vue/runtime-dom' {
    export interface HTMLAttributes {
        $children?: VNodeChild
    }
    export interface SVGAttributes {
        $children?: VNodeChild
    }
}


declare module '@vue/runtime-core' {
    interface EvanceUi {
        defaults: DefaultsInstance,
        display: UnwrapNestedRefs<DisplayInstance>,
        date: DateAdapterInstance,
        locale: UnwrapNestedRefs<LocaleManager>
    }

    export interface GlobalComponents {
        // @generate-components
    }
}
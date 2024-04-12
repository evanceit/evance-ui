import {InjectionKey} from "vue";
import {GroupProvide} from "@/composables/group.ts";

export const EvTabsSymbol: InjectionKey<GroupProvide> = Symbol.for('ev:tabs');
// Javascript transitions
import {createJavaScriptTransition} from "@/components/EvTransition/transitions/createTransition.ts";
import ExpandTransitionGenerator from './expandTransition'
import {FunctionalComponent} from "vue";

export const EvTransitionExpand = createJavaScriptTransition('expand-transition', ExpandTransitionGenerator());
export const EvTransitionExpandX = createJavaScriptTransition('expand-x-transition', ExpandTransitionGenerator('', true));


export type EvTransitionExpand = FunctionalComponent<typeof EvTransitionExpand>;
export type EvTransitionExpandX = FunctionalComponent<typeof EvTransitionExpandX>;
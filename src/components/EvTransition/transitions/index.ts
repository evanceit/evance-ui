// Javascript transitions
import {createJavaScriptTransition} from "@/components/EvTransition/transitions/createTransition.ts";
import ExpandTransitionGenerator from './expandTransition'
import {FunctionalComponent} from "vue";

export const EvExpandTransition = createJavaScriptTransition('expand-transition', ExpandTransitionGenerator());
export const EvExpandXTransition = createJavaScriptTransition('expand-x-transition', ExpandTransitionGenerator('', true));


export type EvExpandTransition = FunctionalComponent<typeof EvExpandTransition>;
export type EvExpandXTransition = FunctionalComponent<typeof EvExpandXTransition>;
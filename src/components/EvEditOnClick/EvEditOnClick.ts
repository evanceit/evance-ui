import { omit, propsFactory } from "@/util";
import { PropType } from "vue";
import { makeEvTextfieldProps } from "@/components/EvTextfield";

export type EvEditOnClickConfirmContext<T = any> = {
    value: T;
    previousValue: T;
    confirm: () => void;
    cancel: () => void;
};

export type EvEditOnClickConfirmResult<T = any> =
    | void
    | boolean
    | {
          valid?: boolean;
          value?: T;
          errors?: string[];
      };

export type EvEditOnClickConfirm<T = any> = (
    context: EvEditOnClickConfirmContext<T>,
) => EvEditOnClickConfirmResult<T> | Promise<EvEditOnClickConfirmResult<T>>;

type ClickOutsideInclude =
    | (() => Array<HTMLElement | null | undefined>)
    | Array<HTMLElement | null | undefined>
    | HTMLElement
    | null
    | undefined;

export const makeEvEditOnClickProps = propsFactory(
    {
        editing: Boolean,
        modelValue: null,
        persistent: Boolean,
        hideActions: Boolean,
        onConfirm: Function as PropType<EvEditOnClickConfirm>,
        clickOutsideInclude: [
            Function,
            Array,
            Object,
        ] as PropType<ClickOutsideInclude>,

        ...omit(makeEvTextfieldProps(), [
            "modelValue",
            "appearance",
            "rounded",
        ]),
    },
    "EvEditOnClick",
);

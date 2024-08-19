import { isDeepEqual, propsFactory } from "@/util";
import { makeFormFieldProps } from "@/composables/validation.ts";
import { makeComponentProps } from "@/composables/component.ts";
import { computed, ExtractPropTypes, PropType, Ref } from "vue";
import { makeLabelProps } from "@/components/EvLabel";

/**
 * # Make EvCheckbox Props
 */
export const makeEvCheckboxProps = propsFactory(
    {
        trueValue: null,
        falseValue: null,
        value: null,
        valueComparator: {
            type: Function as PropType<typeof isDeepEqual>,
            default: isDeepEqual,
        },

        ...makeLabelProps(),
        ...makeFormFieldProps(),
        ...makeComponentProps(),
    },
    "EvSwitch",
);

/**
 * # Use Toggle Control
 *
 * @param modelProxy
 * @param props
 */
export function useToggleControl(
    modelProxy: Ref<any>,
    props: ExtractPropTypes<ReturnType<typeof makeEvCheckboxProps>>,
) {
    /**
     * ## True Value
     */
    const trueValue = computed(() => {
        if (props.trueValue !== undefined) {
            return props.trueValue;
        }
        return props.value !== undefined ? props.value : true;
    });

    /**
     * ## False Value
     */
    const falseValue = computed(() => {
        return props.falseValue !== undefined ? props.falseValue : false;
    });

    /**
     * ## Is Checked
     */
    const isChecked = computed({
        get() {
            return props.valueComparator(modelProxy.value, trueValue.value);
        },
        set(value: boolean) {
            if (props.readonly) {
                return;
            }
            const currentValue = value ? trueValue.value : falseValue.value;
            const newValue = currentValue;
            // I might do some funky stuff here later for multi-selection and groups
            modelProxy.value = newValue;
        },
    });

    return {
        trueValue,
        falseValue,
        isChecked,
    };
}

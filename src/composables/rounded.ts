import {computed, isRef, Ref} from "vue";
import {propsFactory} from "@/util";


type RoundedValue = boolean | string | number | null | undefined;

export interface RoundedProps {
    rounded?: RoundedValue;
    tile?: boolean;
}

type RoundedData = {
    roundedClasses: Ref<string[]>
};

export const makeRoundedProps = propsFactory({
    rounded: {
        type: [Boolean, Number, String],
        default: undefined
    },
}, 'rounded');


export function useRounded (
    props: RoundedProps | Ref<RoundedValue>
): RoundedData {
    const roundedClasses = computed(() => {
        const rounded = isRef(props) ? props.value : props.rounded;
        const classes: string[] = [];

        if (rounded === true || rounded === '') {
            classes.push('is-rounded');
        } else if (typeof rounded === 'string' || rounded === 0) {
            for (const value of String(rounded).split(' ')) {
                classes.push(`is-rounded-${value}`)
            }
        }

        return classes;
    });

    return { roundedClasses };
}
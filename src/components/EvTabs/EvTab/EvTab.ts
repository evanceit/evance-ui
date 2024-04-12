import {omit, propsFactory} from "@/util";
import {makeEvButtonProps} from "@/components";

/**
 * # makeEvTabProps()
 */
export const makeEvTabProps = propsFactory({
    ...omit(makeEvButtonProps({
        variant: 'subtle' as const
    }), [
        'active',
        'symbol'
    ])
}, 'EvTab');
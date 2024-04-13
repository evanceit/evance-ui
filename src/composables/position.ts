import {Anchor, AnchorSelector, propsFactory} from "@/util";
import {computed, CSSProperties, PropType} from "vue";
import {useRtl} from "@/composables/locale.ts";


export interface PositionProps {
    position?: AnchorSelector
}

export const makePositionProps = propsFactory({
    position: String as PropType<AnchorSelector>
}, 'position');

const oppositeMap = {
    center: 'center',
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
} as const;

export type Position = 'top' | 'bottom' | 'left' | 'right';
export type Alignment = 'left' | 'right' | 'center';

export function usePosition(
    props: PositionProps,
    opposite = false,
    offset?: (side: string) => number
) {
    const { isRtl } = useRtl();

    const positionStyles = computed(() => {
        if (!props.position) {
            return {};
        }
        const anchor = Anchor.fromSelector(props.position, isRtl.value);

        function getOffset(side: string) {
            return offset ? offset(side) : 0;
        }

        const styles = {} as CSSProperties;

        if (anchor.side !== 'center' && anchor.side !== 'auto') {
            if (opposite) {
                styles[oppositeMap[anchor.side]] = `calc(100% - ${getOffset(anchor.side)}px)`;
            } else {
                styles[anchor.side]  = 0;
            }
        }

        if (anchor.physicalAlignment !== 'center') {
            if (opposite) {
                styles[oppositeMap[anchor.physicalAlignment]] = `calc(100% - ${getOffset(anchor.physicalAlignment)}px)`;
            } else {
                styles[anchor.physicalAlignment] = 0
            }
        } else {
            if (anchor.side === 'center') {
                styles.top = styles.left = '50%';
            } else {
                styles[({
                    top: 'left',
                    bottom: 'left',
                    left: 'top',
                    right: 'top',
                } as const)[anchor.side as Position]] = '50%';
            }
            if (anchor.side !== 'auto') {
                styles.transform = {
                    top: 'translateX(-50%)',
                    bottom: 'translateX(-50%)',
                    left: 'translateY(-50%)',
                    right: 'translateY(-50%)',
                    center: 'translate(-50%, -50%)',
                }[anchor.side];
            }
        }

        return styles;

    });

    return { positionStyles };
}
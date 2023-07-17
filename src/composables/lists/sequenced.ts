/**
 * # Sequenced Position
 *
 * Typically applies to requests to move a node within a sequence.
 *
 * - 'after' - Position a node after another node as its sibling
 * - 'before' - Position a node before another node as its sibling
 * - 'first' - Position a node as the first child in the sequence
 * - 'last' - Position a node as the last child in the sequence
 */
export type SequencedPosition = 'after'
    | 'before'
    | 'first'
    | 'last';
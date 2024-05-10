/**
 * # randomArrayItem
 *
 * Returns a random element from any array, or `undefined` if the array is empty.
 *
 * You can change the value returned if the array is empty by supplying the `emptyValue`.
 *
 * @param array
 * @param emptyValue
 */
export function randomArrayItem(array: any[], emptyValue?: any) {
    if (array.length === 0) {
        return emptyValue;
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

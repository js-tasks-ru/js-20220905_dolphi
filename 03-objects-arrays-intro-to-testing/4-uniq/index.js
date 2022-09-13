/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
    if (arr === undefined ) return [];
    const set = new Set(arr);
    for (let symb of arr) { set.add(symb); }
    return [...set];
}

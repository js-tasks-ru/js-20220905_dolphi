/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size === undefined ) return string;
    if (!size) return "";

    let lastIndexes = [0];
    let [prevSymb] = string;
    for (let i = 0; i < string.length; i++) {
        if (string[i] !== prevSymb) {
            prevSymb = string[i];
            lastIndexes.push(i);
        }
    }
    
    // const nextChar = string[val+1];
    // const currentChar = string[val];
    return lastIndexes.reduce((result, val) => ( 
        (string[val+1] != string[val]) ? 
        (result + string.slice(val, val+1)) : 
        (result + string.slice(val, val+size))
    ), "");
}

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {    
    const newArr = [...arr];
    
    const compareStrings = (str1, str2) => {
       return str1.localeCompare(str2, ['ru', 'en'], { caseFirst: "upper" });
    };

    return newArr.sort((str1, str2) => {
        if (param === "asc") {
           return compareStrings(str1, str2); 
        } else {
            return compareStrings(str2, str1);
        }
    });
}
/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */


export const pick = (obj, ...fields) => {
    const newObj = {};
    for (const ind in fields) {
        if (fields[ind] in obj) {
            newObj[fields[ind]] = obj[fields[ind]];
        }
    }
    return newObj;
};

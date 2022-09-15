/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
 export const omit = (obj, ...fields) => {
    const newObj = {};
    for (const key in obj) {
        if (checkIfEquals(key, fields)) {
            continue;
        }
        newObj[key] = obj[key];
    }
    return newObj; 
};

function checkIfEquals(key, fields) {
    for (let prop of fields) {
        if (prop === key) {
            return true;
        }
    }
    return false;
}

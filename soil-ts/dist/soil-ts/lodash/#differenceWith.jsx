import baseDifference from "./_internal/_baseDifference";
import baseFlatten from "./_internal/_baseFlatten";
import isArrayLikeObject from "./#isArrayLikeObject";
import last from "./#last";
function differenceWith(array) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var comparator = last(values);
    if (isArrayLikeObject(comparator)) {
        comparator = undefined;
    }
    return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator) : [];
}
export default differenceWith;
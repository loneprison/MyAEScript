// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: https://github.com/loneprison/MyAEScript
// - 2025/3/21 14:00:42

(function() {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeToString = objectProto.toString;
    var nativeParseInt = parseInt;
    var NAN = 0 / 0;
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 1.7976931348623157e308;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var reIsPlainProp = /^\w*$/;
    var charCodeOfDot = ".".charCodeAt(0);
    var reEscapeChar = /\\(\\)?/g;
    var rePropName = /[^.[\]]+|\[(?:([^"'][^[]*)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    function has(object, key) {
        return object != null && hasOwnProperty.call(object, key);
    }
    function isObject(value) {
        if (value == null) {
            return false;
        }
        var type = typeof value;
        return type === "object" || type === "function";
    }
    function assign(object, source) {
        var result = Object(object);
        if (isObject(source)) {
            for (var key in source) {
                if (has(source, key)) {
                    result[key] = source[key];
                }
            }
        }
        return result;
    }
    function getTag(value) {
        if (value == null) {
            return value === undefined ? "[object Undefined]" : "[object Null]";
        }
        return nativeToString.call(value);
    }
    function isArray(value) {
        return getTag(value) == "[object Array]";
    }
    function isObjectLike(value) {
        return typeof value === "object" && value !== null;
    }
    function isArguments(value) {
        return isObjectLike(value) && getTag(value) == "[object Arguments]";
    }
    function or() {
        var index = -1;
        var length = arguments.length;
        while (++index < length) {
            if (arguments[index]) {
                return true;
            }
        }
        return false;
    }
    function isKey(value, object) {
        if (isArray(value)) {
            return false;
        }
        var type = typeof value;
        if (type === "number" || type === "boolean" || value == null) {
            return true;
        }
        return or(reIsPlainProp.test(value), !reIsDeepProp.test(value), object != null && value in Object(object));
    }
    function trimString(string) {
        return string.replace(/^\s+/, "").replace(/\s+$/, "");
    }
    function stringToPath(string) {
        var result = [];
        if (string.charCodeAt(0) === charCodeOfDot) {
            result.push("");
        }
        string.replace(rePropName, function(match, expression, quote, subString) {
            var key = match;
            if (quote) {
                key = subString.replace(reEscapeChar, "$1");
            } else if (expression) {
                key = trimString(expression);
            }
            result.push(key);
        });
        return result;
    }
    function castPath(value, object) {
        if (isArray(value)) {
            return value;
        }
        return isKey(value, object) ? [ value ] : stringToPath(value);
    }
    function toKey(value) {
        if (typeof value === "string") {
            return value;
        }
        var result = "".concat(value);
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    function baseGet(object, path) {
        var partial = castPath(path, object);
        var index = 0;
        var length = partial.length;
        while (object != null && index < length) {
            object = object[toKey(partial[index++])];
        }
        return index && index == length ? object : undefined;
    }
    function get(object, path, defaultValue) {
        var result = object == null ? undefined : baseGet(object, path);
        return result === undefined ? defaultValue : result;
    }
    function map(array, iteratee) {
        var index = -1;
        var length = array == null ? 0 : array.length;
        var result = new Array(length);
        while (++index < length) {
            result[index] = iteratee(array[index], index, array);
        }
        return result;
    }
    function isLength(value) {
        return typeof value === "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isArrayLike(value) {
        return value != null && typeof value !== "function" && isLength(value.length);
    }
    function reduce(array, iteratee, initialValue) {
        var length = array.length;
        if (length === 0 && initialValue === undefined) {
            return undefined;
        }
        var accumulator = initialValue === undefined ? array[0] : initialValue;
        var startIndex = initialValue === undefined ? 0 : -1;
        var currentIndex = startIndex;
        while (++currentIndex < length) {
            accumulator = iteratee(accumulator, array[currentIndex], currentIndex, array);
        }
        return accumulator;
    }
    function toNumber(value) {
        if (typeof value === "number") {
            return value;
        }
        if (isObject(value)) {
            var other = typeof value.valueOf === "function" ? value.valueOf() : value;
            value = isObject(other) ? "".concat(other) : other;
        }
        if (typeof value !== "string") {
            return value === 0 ? value : +value;
        }
        value = value.replace(reTrim, "");
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? nativeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    function toFinite(value) {
        if (!value) {
            return value === 0 ? value : 0;
        }
        value = toNumber(value);
        if (value === INFINITY || value === -INFINITY) {
            var sign = value < 0 ? -1 : 1;
            return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
    }
    function compact(array) {
        var index = -1, length = array.length, resIndex = 0, result = [];
        while (++index < length) {
            var value = array[index];
            if (value) {
                result[resIndex++] = value;
            }
        }
        return result;
    }
    function forEach(array, iteratee) {
        var index = -1;
        var length = array.length;
        while (++index < length) {
            if (iteratee(array[index], index, array) === false) {
                break;
            }
        }
        return array;
    }
    function some(array, predicate) {
        var index = -1;
        var length = array.length;
        while (++index < length) {
            if (predicate(array[index], index, array)) {
                return true;
            }
        }
        return false;
    }
    function isEmpty(value) {
        if (value == null) {
            return true;
        }
        if (isArrayLike(value) && (isArray(value) || typeof value === "string" || isArguments(value))) {
            return !value.length;
        }
        for (var key in value) {
            if (has(value, key)) {
                return false;
            }
        }
        return true;
    }
    function baseRange(start, end, step, fromRight) {
        var index = -1;
        var length = Math.max(Math.ceil((end - start) / (step || 1)), 0);
        var result = new Array(length);
        while (length--) {
            result[fromRight ? length : ++index] = start;
            start += step;
        }
        return result;
    }
    function createRange(fromRight) {
        return function(start, end, step) {
            start = toFinite(start);
            if (end === undefined) {
                end = start;
                start = 0;
            } else {
                end = toFinite(end);
            }
            if (step === undefined) {
                step = start < end ? 1 : -1;
            } else {
                step = toFinite(step);
            }
            return baseRange(start, end, step, fromRight);
        };
    }
    var range = createRange();
    function createIsNativeType(nativeObject) {
        return function(value) {
            return value != null && value instanceof nativeObject;
        };
    }
    var isCompItem = createIsNativeType(CompItem);
    function isLayer(value) {
        return has(value, "containingComp") && isCompItem(value.containingComp) && value.parentProperty === null && value.propertyDepth === 0;
    }
    var isMaskPropertyGroup = createIsNativeType(MaskPropertyGroup);
    var isPropertyGroup = createIsNativeType(PropertyGroup);
    function isAddableProperty(value) {
        return isPropertyGroup(value) || isMaskPropertyGroup(value) || isLayer(value);
    }
    function addProperty(rootProperty, path) {
        var index = 0;
        var length = path.length;
        var nested = rootProperty;
        while (nested && isAddableProperty(nested) && index < length) {
            var name = path[index++];
            var next = nested.property(name);
            if (next) {
                nested = next;
            } else if (nested.canAddProperty(name)) {
                nested = nested.addProperty(name);
            }
        }
        return index && index === length ? nested : undefined;
    }
    var isProperty = createIsNativeType(Property);
    function isCustomValueProperty(property) {
        return isProperty(property) && property.propertyValueType === PropertyValueType.CUSTOM_VALUE;
    }
    function isNoValueProperty(property) {
        return isProperty(property) && property.propertyValueType === PropertyValueType.NO_VALUE;
    }
    function canSetPropertyValue(property) {
        return isProperty(property) && !isNoValueProperty(property) && !isCustomValueProperty(property);
    }
    function collectionEach(collection, iteratee) {
        var index = 0;
        var length = collection.length + 1;
        while (++index < length) {
            if (iteratee(collection[index], index, collection) === false) {
                break;
            }
        }
        return collection;
    }
    function collectionToArray(collection) {
        var result = Array(collection.length);
        collectionEach(collection, function(item, index) {
            result[index - 1] = item;
        });
        return result;
    }
    function getActiveItem() {
        return app.project.activeItem;
    }
    function getActiveComp() {
        var item = getActiveItem();
        return isCompItem(item) ? item : undefined;
    }
    function createGetAppProperty(path) {
        return function() {
            return get(app, path);
        };
    }
    var getSelectedLayers = createGetAppProperty([ "project", "activeItem", "selectedLayers" ]);
    var isAVLayer = createIsNativeType(AVLayer);
    function setPropertyValue(rootProperty, path, value) {
        var property = addProperty(rootProperty, path);
        if (canSetPropertyValue(property)) {
            property.setValue(value);
            return property;
        }
    }
    function setUndoGroup(undoString, func) {
        app.beginUndoGroup(undoString);
        func();
        app.endUndoGroup();
    }
    function mergeTwoBounds(current, newBounds) {
        var currMinX = current[0], currMinY = current[1], currMaxX = current[2], currMaxY = current[3];
        var newMinX = newBounds[0], newMinY = newBounds[1], newMaxX = newBounds[2], newMaxY = newBounds[3];
        return [ Math.min(currMinX, newMinX), Math.min(currMinY, newMinY), Math.max(currMaxX, newMaxX), Math.max(currMaxY, newMaxY) ];
    }
    function getBoundsByLayer(layer) {
        if (!isAVLayer(layer)) {
            return [ 0, 0, 0, 0 ];
        }
        var width = layer.width, height = layer.height;
        var vertices = [ [ 0, 0 ], [ width, 0 ], [ width, height ], [ 0, height ] ];
        var initialBounds = [ Infinity, Infinity, -Infinity, -Infinity ];
        return reduce(map(vertices, function(v) {
            var _a = layer.sourcePointToComp(v), x = _a[0], y = _a[1];
            return [ x, y, x, y ];
        }), function(currentBounds, pointBounds) {
            return mergeTwoBounds(currentBounds, pointBounds);
        }, initialBounds);
    }
    function mergeBounds(boundsList) {
        if (isEmpty(boundsList)) {
            throw new Error("boundsList 不能为空");
        }
        return reduce(boundsList, function(currentBounds, newBounds) {
            return mergeTwoBounds(currentBounds, newBounds);
        }, [ Infinity, Infinity, -Infinity, -Infinity ]);
    }
    function getBoundsByLayers(layers) {
        return mergeBounds(map(layers, getBoundsByLayer));
    }
    setUndoGroup("Resize Comp to Selected Layers", function() {
        var comp = getActiveComp();
        var selectedLayers = getSelectedLayers();
        var ALL_NOT_AVlayer = some(selectedLayers, function(layer) {
            return !isAVLayer(layer);
        });
        if (!comp || ALL_NOT_AVlayer) {
            return alert("需要至少选择一个有效图层\n形状/文字/灯光/摄像机图层不支持");
        }
        var layers = collectionToArray(comp.layers);
        var originalState = map(layers, function(layer) {
            var state = {
                parent: layer.parent,
                locked: layer.locked
            };
            assign(layer, {
                locked: false,
                parent: null
            });
            return state;
        });
        var newBounds = getBoundsByLayers(selectedLayers);
        var nullLayer = comp.layers.addNull();
        var setNullLayerPosition = function(position) {
            setPropertyValue(nullLayer, [ "ADBE Transform Group", "ADBE Position" ], position);
        };
        setNullLayerPosition([ newBounds[0], newBounds[1] ]);
        comp.width = Math.ceil(newBounds[2] - newBounds[0]);
        comp.height = Math.ceil(newBounds[3] - newBounds[1]);
        forEach(range(2, comp.numLayers + 1), function(i) {
            comp.layer(i).parent = nullLayer;
        });
        setNullLayerPosition([ 0, 0 ]);
        nullLayer.source.remove();
        forEach(layers, function(layer, i) {
            assign(layer, originalState[i]);
        });
        var alertMessage = compact([ comp.width % 2 !== 0 ? "合成宽度为奇数!!!" : null, comp.height % 2 !== 0 ? "合成高度为奇数!!!" : null ]).join("\n");
        if (alertMessage) {
            alert(alertMessage);
        }
    });
}).call(this);

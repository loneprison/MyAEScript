// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: {未填写/未公开}
// - 2024/12/9 16:18:55

(function() {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeToString = objectProto.toString;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    function has(object, key) {
        return object != null && hasOwnProperty.call(object, key);
    }
    function contains(array, value) {
        var index = -1;
        var length = array.length;
        while (++index < length) {
            if (array[index] === value) {
                return true;
            }
        }
        return false;
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
    function omit(obj, keys) {
        var result = {};
        for (var key in obj) {
            if (has(obj, key) && !contains(keys, key)) {
                result[key] = obj[key];
            }
        }
        return result;
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
    function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER : length;
        return !!length && or(type === "number", reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
    }
    function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value);
        var isArg = !isArr && isArguments(value);
        var skipIndexes = isArr || isArg;
        var length = value.length;
        var result = new Array(skipIndexes ? length : 0);
        var index = skipIndexes ? -1 : length;
        while (++index < length) {
            result[index] = "".concat(index);
        }
        for (var key in value) {
            if (has(value, key) && !(skipIndexes && (key === "length" || isIndex(key, length)))) {
                result.push(key);
            }
        }
        return result;
    }
    function isLength(value) {
        return typeof value === "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isArrayLike(value) {
        return value != null && typeof value !== "function" && isLength(value.length);
    }
    function keys(object) {
        if (object == null) {
            return [];
        }
        if (isArrayLike(object)) {
            return arrayLikeKeys(object);
        }
        var result = [];
        for (var key in object) {
            if (has(object, key)) {
                result.push(key);
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
    function forOwn(object, iteratee) {
        for (var key in object) {
            if (has(object, key)) {
                if (iteratee(object[key], key, object) === false) {
                    break;
                }
            }
        }
        return object;
    }
    function isDate(value) {
        return isObjectLike(value) && getTag(value) == "[object Date]";
    }
    function isString(value) {
        var type = typeof value;
        return type === "string" || type === "object" && value != null && !isArray(value) && getTag(value) == "[object String]";
    }
    var jsonEscapes = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\v": "\\v",
        '"': '\\"',
        "\\": "\\\\"
    };
    var reEscapedJson = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var reHasEscapedJson = new RegExp(reEscapedJson.source);
    function concatJson(head, partial, gap, mind, tail) {
        return gap ? head + "\n" + gap + partial.join(",\n" + gap) + "\n" + mind + tail : head + partial.join(",") + tail;
    }
    function concatJsonKey(string) {
        return reHasEscapedJson.test(string) ? '"' + escapeJsonKey(string) + '"' : '"' + string + '"';
    }
    function concatSpaceIndent(n) {
        var indent = "", index = -1;
        while (++index < n) {
            indent += " ";
        }
        return indent;
    }
    function escapeJsonKey(string) {
        return string.replace(reEscapedJson, function(matched) {
            var escaped = has(jsonEscapes, matched) ? jsonEscapes[matched] : undefined;
            return isString(escaped) ? escaped : hexEncode(matched);
        });
    }
    function getPrimitiveValue(value) {
        return isDate(value) ? value.toString() : value.valueOf();
    }
    function hexEncode(string) {
        return "\\u" + ("0000" + string.charCodeAt(0).toString(16)).slice(-4);
    }
    function stringify(value, indent) {
        if (indent === void 0) {
            indent = 4;
        }
        return stringifyValue(value, isString(indent) ? indent : concatSpaceIndent(indent), "");
    }
    function stringifyArray(array, indent, gap) {
        var mind = gap;
        gap += indent;
        var partial = [];
        forEach(array, function(value, index) {
            partial[index] = stringifyValue(value, indent, gap);
        });
        return partial.length === 0 ? "[]" : concatJson("[", partial, gap, mind, "]");
    }
    function stringifyObject(object, indent, gap) {
        var mind = gap;
        gap += indent;
        var colon = gap ? ": " : ":";
        var partial = [];
        forOwn(object, function(value, key) {
            partial.push(concatJsonKey(key) + colon + stringifyValue(value, indent, gap));
        });
        return partial.length === 0 ? "{}" : concatJson("{", partial, gap, mind, "}");
    }
    function stringifyValue(value, indent, gap) {
        if (value == null) {
            return "null";
        }
        var primitive = getPrimitiveValue(value);
        switch (typeof primitive) {
          case "string":
            return concatJsonKey(primitive);

          case "number":
            return isFinite(primitive) ? String(primitive) : "null";

          case "boolean":
            return String(primitive);

          case "object":
            return isArray(primitive) ? stringifyArray(primitive, indent, gap) : stringifyObject(primitive, indent, gap);

          case "function":
            return '"' + escapeJsonKey(primitive.toString()) + '"';

          default:
            return "null";
        }
    }
    var data = {
        "G0006 ADBE Transform Group": {
            "P0002 ADBE Position": {
                "name": "位置",
                "value": [ 960, 540, 0 ]
            },
            "P0003 ADBE Position_0": {
                "name": "X 位置",
                "value": 960
            },
            "P0004 ADBE Position_1": {
                "name": "Y 位置",
                "value": 540
            }
        }
    };
    var rootKey = keys(data)[0];
    data[rootKey] = omit(data[rootKey], [ "P0002 ADBE Position" ]);
    $.write(stringify(data));
}).call(this);
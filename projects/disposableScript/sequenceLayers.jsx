// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: https://github.com/loneprison/MyAEScript
// - 2025/3/19 14:48:24

(function() {
    var objectProto = Object.prototype;
    var nativeToString = objectProto.toString;
    var INFINITY = 1 / 0;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var reIsPlainProp = /^\w*$/;
    var charCodeOfDot = ".".charCodeAt(0);
    var reEscapeChar = /\\(\\)?/g;
    var rePropName = /[^.[\]]+|\[(?:([^"'][^[]*)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    function getTag(value) {
        if (value == null) {
            return value === undefined ? "[object Undefined]" : "[object Null]";
        }
        return nativeToString.call(value);
    }
    function isArray(value) {
        return getTag(value) == "[object Array]";
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
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
        var length = array.length;
        var index = fromIndex + -1;
        while (++index < length) {
            if (predicate(array[index], index, array)) {
                return index;
            }
        }
        return -1;
    }
    function baseIsNaN(value) {
        return value !== value;
    }
    function strictIndexOf(array, value, fromIndex) {
        var index = fromIndex - 1;
        var length = array.length;
        while (++index < length) {
            if (array[index] === value) {
                return index;
            }
        }
        return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
        return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
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
    function indexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
            return -1;
        }
        var index = 0;
        return baseIndexOf(array, value, index);
    }
    function createIsNativeType(nativeObject) {
        return function(value) {
            return value != null && value instanceof nativeObject;
        };
    }
    var isCompItem = createIsNativeType(CompItem);
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
    function createIsAVLayer(callback) {
        return function(value) {
            return isAVLayer(value) && callback(value);
        };
    }
    var isCompLayer = createIsAVLayer(function(layer) {
        return isCompItem(layer.source);
    });
    function setUndoGroup(undoString, func) {
        app.beginUndoGroup(undoString);
        func();
        app.endUndoGroup();
    }
    function sortLayersByIndex(layerArray, order) {
        return layerArray.sort(function(a, b) {
            {
                return b.index - a.index;
            }
        });
    }
    function sortLayersByName(layerArray, order) {
        return layerArray.sort(function(a, b) {
            var getSortKey = function(name) {
                var numberPart = /\d+$/.exec(name);
                var textPart = name.replace(/\d+$/, "");
                return {
                    number: numberPart ? parseInt(numberPart[0], 10) : NaN,
                    text: textPart
                };
            };
            var keyA = getSortKey(a.name);
            var keyB = getSortKey(b.name);
            if (!isNaN(keyA.number) && !isNaN(keyB.number)) {
                return keyA.number - keyB.number;
            } else if (!isNaN(keyA.number)) {
                return -1;
            } else if (!isNaN(keyB.number)) {
                return 1;
            }
            return keyA.text.localeCompare(keyB.text);
        });
    }
    var getStr = function(str) {
        return str;
    };
    var isWhatStr = function(str) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return indexOf(args, str) !== -1;
    };
    var isAllCompLayer = function(layerArray) {
        return !some(layerArray, function(layer) {
            return !isCompLayer(layer);
        });
    };
    var sortAndSetLayerTimes = function(layers, sortMode, frameDuration) {
        var sortedLayers = sortMode === "index" ? sortLayersByIndex(layers) : sortLayersByName(layers);
        var currentStartTime = 0;
        forEach(sortedLayers, function(layer) {
            layer.outPoint = frameDuration;
            layer.startTime = frameDuration * currentStartTime++;
            layer.moveToBeginning();
        });
        return sortedLayers;
    };
    var setCompDuration = function(comp, layers, frameDuration) {
        comp.duration = layers.length * frameDuration;
    };
    function SequenceLayers(sortMode, selectMode) {
        if (selectMode === "current") {
            var selectedLayers = getSelectedLayers();
            var activeComp = getActiveComp();
            if (selectedLayers && activeComp) {
                var frameDuration = 1 / activeComp.frameRate;
                selectedLayers = sortAndSetLayerTimes(selectedLayers, sortMode, frameDuration);
                setCompDuration(activeComp, selectedLayers, frameDuration);
            }
        } else {
            var selectedLayers = getSelectedLayers();
            if (isAllCompLayer(selectedLayers)) {
                forEach(selectedLayers, function(layer) {
                    var comp = layer.source;
                    var frameDuration = 1 / comp.frameRate;
                    if (isCompItem(comp)) {
                        var layerArray = sortAndSetLayerTimes(collectionToArray(comp.layers), sortMode, frameDuration);
                        setCompDuration(comp, layerArray, frameDuration);
                    }
                });
            } else {
                alert("不能选择非comp图层");
            }
        }
    }
    setUndoGroup("SequenceLayers", function() {
        var sortMode = getStr("index");
        var selectMode = getStr("current");
        if (isWhatStr(sortMode, "index", "name") && isWhatStr(selectMode, "current", "internal")) {
            SequenceLayers(sortMode, selectMode);
        }
    });
}).call(this);

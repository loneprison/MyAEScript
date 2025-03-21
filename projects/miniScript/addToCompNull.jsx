// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: https://github.com/loneprison/MyAEScript
// - 2025/3/19 14:49:47

(function() {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeToString = objectProto.toString;
    var INFINITY = 1 / 0;
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
    function map(array, iteratee) {
        var index = -1;
        var length = array == null ? 0 : array.length;
        var result = new Array(length);
        while (++index < length) {
            result[index] = iteratee(array[index], index, array);
        }
        return result;
    }
    function filter(array, predicate) {
        var index = -1;
        var resIndex = 0;
        var length = array == null ? 0 : array.length;
        var result = [];
        while (++index < length) {
            var value = array[index];
            if (predicate(value, index, array)) {
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
    function isNil(value) {
        return value == null;
    }
    function startsWith(string, target, position) {
        var length = string.length;
        position = position == null ? 0 : position;
        if (position < 0) {
            position = 0;
        } else if (position > length) {
            position = length;
        }
        target = "".concat(target);
        return string.slice(position, position + target.length) == target;
    }
    function createIsNativeType(nativeObject) {
        return function(value) {
            return value != null && value instanceof nativeObject;
        };
    }
    var IS_KEY_LABEL_EXISTS = parseFloat(app.version) > 22.5;
    var PROPERTY_INTERPOLATION_TYPE = [ 6612, 6613, 6614 ];
    var isCompItem = createIsNativeType(CompItem);
    function isLayer(value) {
        return has(value, "containingComp") && isCompItem(value.containingComp) && value.parentProperty === null && value.propertyDepth === 0;
    }
    var isMaskPropertyGroup = createIsNativeType(MaskPropertyGroup);
    var isPropertyGroup = createIsNativeType(PropertyGroup);
    function isAddableProperty(value) {
        return isPropertyGroup(value) || isMaskPropertyGroup(value) || isLayer(value);
    }
    function addPropertyAlone(rootProperty, path) {
        var index = 0;
        var length = path.length;
        var nested = rootProperty;
        while (nested && isAddableProperty(nested) && index < length) {
            var name = String(path[index++]);
            nested = nested.canAddProperty(name) ? nested.addProperty(name) : nested.property(name);
        }
        return index && index === length ? nested : undefined;
    }
    function getValidInterpolationTypes(property) {
        return filter(PROPERTY_INTERPOLATION_TYPE, function(enumNumber) {
            return property.isInterpolationTypeValid(enumNumber);
        });
    }
    function isHoldInterpolationTypeOnly(property) {
        var validInterpolationTypes = getValidInterpolationTypes(property);
        return validInterpolationTypes.length === 1 && validInterpolationTypes[0] === KeyframeInterpolationType.HOLD;
    }
    function canSetKeyframeVelocity(property) {
        return !isHoldInterpolationTypeOnly(property);
    }
    var isProperty = createIsNativeType(Property);
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
    var getFirstSelectedLayer = createGetAppProperty([ "project", "activeItem", "selectedLayers", "0" ]);
    var isAVLayer = createIsNativeType(AVLayer);
    function createIsAVLayer(callback) {
        return function(value) {
            return isAVLayer(value) && callback(value);
        };
    }
    function isColorProperty(property) {
        return isProperty(property) && property.propertyValueType === PropertyValueType.COLOR;
    }
    var isCompLayer = createIsAVLayer(function(layer) {
        return isCompItem(layer.source);
    });
    var isSolidSource = createIsNativeType(SolidSource);
    function isSolidLayer(value) {
        return isAVLayer(value) && isSolidSource(value.source.mainSource);
    }
    function mapTemporalEaseValueToClasses(keyTemporalEaseValue) {
        return map(keyTemporalEaseValue, function(keyframeEase) {
            var speed = keyframeEase.speed;
            var influence = keyframeEase.influence;
            return new KeyframeEase(speed, influence === 0 ? 0.1 : influence);
        });
    }
    function setKeyframeValues(property, keyframeValues) {
        if (keyframeValues.length === 0) {
            return;
        }
        forEach(keyframeValues, function(keyframe) {
            var keyTime = keyframe.keyTime;
            var keyValue = keyframe.keyValue;
            property.setValueAtTime(keyTime, keyValue);
        });
        var isSpatialValue = property.isSpatial && !isColorProperty(property);
        var canSetVelocity = canSetKeyframeVelocity(property);
        forEach(keyframeValues, function(keyframe) {
            var keyIndex = property.nearestKeyIndex(keyframe.keyTime);
            var keyInSpatialTangent = keyframe.keyInSpatialTangent;
            var keyOutSpatialTangent = keyframe.keyOutSpatialTangent;
            var keySpatialAutoBezier = keyframe.keySpatialAutoBezier;
            var keySpatialContinuous = keyframe.keySpatialContinuous;
            var keyInTemporalEase = keyframe.keyInTemporalEase;
            var keyOutTemporalEase = keyframe.keyOutTemporalEase;
            var keyTemporalContinuous = keyframe.keyTemporalContinuous;
            var keyTemporalAutoBezier = keyframe.keyTemporalAutoBezier;
            var keyInInterpolationType = keyframe.keyInInterpolationType;
            var keyOutInterpolationType = keyframe.keyOutInterpolationType;
            var keyRoving = keyframe.keyRoving;
            var keyLabel = keyframe.keyLabel;
            var keySelected = keyframe.keySelected;
            if (isSpatialValue) {
                !isNil(keyInSpatialTangent) && property.setSpatialTangentsAtKey(keyIndex, keyInSpatialTangent, keyOutSpatialTangent);
                !isNil(keySpatialAutoBezier) && property.setSpatialAutoBezierAtKey(keyIndex, keySpatialAutoBezier);
                !isNil(keySpatialContinuous) && property.setSpatialContinuousAtKey(keyIndex, keySpatialContinuous);
                !isNil(keyRoving) && property.setRovingAtKey(keyIndex, keyRoving);
            }
            if (canSetVelocity) {
                !isNil(keyInTemporalEase) && property.setTemporalEaseAtKey(keyIndex, mapTemporalEaseValueToClasses(keyInTemporalEase), !isNil(keyOutTemporalEase) ? mapTemporalEaseValueToClasses(keyOutTemporalEase) : void 0);
            }
            !isNil(keyTemporalContinuous) && property.setTemporalContinuousAtKey(keyIndex, keyTemporalContinuous);
            !isNil(keyTemporalAutoBezier) && property.setTemporalAutoBezierAtKey(keyIndex, keyTemporalAutoBezier);
            !isNil(keyInInterpolationType) && property.setInterpolationTypeAtKey(keyIndex, keyInInterpolationType, !isNil(keyOutInterpolationType) ? keyOutInterpolationType : void 0);
            if (IS_KEY_LABEL_EXISTS) {
                !isNil(keyLabel) && property.setLabelAtKey(keyIndex, keyLabel);
            }
            !isNil(keySelected) && property.setSelectedAtKey(keyIndex, keySelected);
        });
    }
    function setUndoGroup(undoString, func) {
        app.beginUndoGroup(undoString);
        func();
        app.endUndoGroup();
    }
    function setPropertyValueByData(property, dataObject) {
        if (has(dataObject, "keyframe")) {
            setKeyframeValues(property, dataObject.keyframe);
        } else if (has(dataObject, "value")) {
            if (isObject(property.value)) {
                var objectValue = dataObject.value;
                var objValue_1 = property.value;
                forOwn(objectValue, function(value, key) {
                    if (value) {
                        objValue_1[key] = value;
                    }
                });
                property.setValue(objValue_1);
            } else {
                property.setValue(dataObject.value);
            }
        }
        if (has(dataObject, "expression")) {
            property.expression = dataObject.expression;
        }
    }
    function setSelfProperty(property, dataObject) {
        var setSelf = function(property_) {
            forOwn(dataObject, function(value, key) {
                if (has(property_, key)) {
                    property_[key] = value;
                }
            });
        };
        var setAndDelete = function(property_, key) {
            if (has(dataObject, key)) {
                property_[key] = dataObject[key];
                delete dataObject[key];
            }
        };
        if (isLayer(property)) {
            var layer_1 = property;
            var layerData = dataObject;
            var locked = has(layerData, "locked") ? layerData.locked : layer_1.locked;
            delete layerData.locked;
            layer_1.locked = false;
            forEach([ "startTime", "inPoint", "outPoint" ], function(key) {
                setAndDelete(layer_1, key);
            });
            if (isSolidLayer(layer_1) || isCompLayer(layer_1)) {
                forEach([ "height", "width" ], function(key) {
                    setAndDelete(layer_1.source, key);
                });
            }
            if (isAVLayer(layer_1) && layer_1.canSetTimeRemapEnabled) {
                setAndDelete(layer_1, "timeRemapEnabled");
            } else {
                delete layerData.timeRemapEnabled;
            }
            setSelf(layer_1);
            layer_1.locked = locked;
        } else {
            setSelf(property);
        }
    }
    function setPropertyByData(rootProperty, propertyData) {
        forOwn(propertyData, function(value, key) {
            if (startsWith(key, "S", 0)) {
                setSelfProperty(rootProperty, value);
                return;
            }
            var subProperty = addPropertyAlone(rootProperty, [ key.substring(6) ]);
            if (startsWith(key, "G", 0)) {
                setPropertyByData(subProperty, value);
            } else if (startsWith(key, "P", 0)) {
                if (isProperty(subProperty)) {
                    setPropertyValueByData(subProperty, value);
                } else {
                    alert("在".concat(key, "键上遇到了错误\n该属性不为Property"));
                }
            } else {
                alert("在".concat(key, "键上遇到了未定义的错误\n【旧版的数据格式可能不支持】\n请检查你的脚本是否为最新"));
                return;
            }
        });
    }
    setUndoGroup("addToCompNull", function() {
        var _a;
        var activeComp = getActiveComp();
        var firstLayer = getFirstSelectedLayer();
        var layerName = "目标点图层";
        if (activeComp) {
            if (!activeComp.activeCamera) {
                alert("请确保合成内至少有一个摄像机/三维图层\n在创建之前将会遇到表达式报错");
            }
            var newNullLayer = activeComp.layers.addNull();
            setPropertyByData(newNullLayer, {
                "S0000 selfProperty": {
                    "name": "Null-toComp"
                },
                "G0005 ADBE Effect Parade": {
                    "G0001 ADBE Layer Control": {
                        "S0000 selfProperty": {
                            "enabled": true,
                            "name": layerName
                        }
                    }
                },
                "G0006 ADBE Transform Group": {
                    "P0001 ADBE Anchor Point": {
                        value: [ newNullLayer.width / 2, newNullLayer.height / 2 ]
                    },
                    "P0002 ADBE Position": {
                        "expression": 'effect("目标点图层")(1).toComp(effect("目标点图层")(1).transform.anchorPoint)'
                    },
                    "P0006 ADBE Scale": {
                        "expression": 'var _layer = effect("目标点图层")(1);\r\n\r\nvar P1 = thisComp.activeCamera.toWorld(transform.anchorPoint);\r\nvar P2 = _layer.toWorld(_layer.transform.anchorPoint);\r\n\r\nvar zoom = thisComp.activeCamera.cameraOption.zoom;\r\nvar cameraForward = normalize(thisComp.activeCamera.toWorldVec([0, 0, 1]));\r\n\r\nvar displacement = P2 - P1;\r\nvar parallelDistance = dot(displacement, cameraForward);\r\n\r\nif (parallelDistance <= 0) {\r\n    [0, 0];\r\n} else {\r\n    var perpendicularDistance = length(displacement - parallelDistance * cameraForward);\r\n    var _scale = zoom / parallelDistance * 100;\r\n\r\n    [_scale, _scale];\r\n}\r\n'
                    }
                }
            });
            if (firstLayer) {
                newNullLayer.moveBefore(firstLayer);
                setPropertyByData(newNullLayer, {
                    "S0000 selfProperty": {
                        "name": "".concat(firstLayer.name, "-toComp")
                    },
                    "G0005 ADBE Effect Parade": (_a = {}, _a["G0001 ".concat(layerName)] = {
                        "P0001 ADBE Layer Control-0001": {
                            value: firstLayer.index
                        }
                    }, _a)
                });
            }
        } else {
            alert("请先选择一个图层");
        }
    });
}).call(this);

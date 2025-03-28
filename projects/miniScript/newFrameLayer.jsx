// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: https://github.com/loneprison/MyAEScript
// - 2024/12/21 22:25:07

(function() {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function has(object, key) {
        return object != null && hasOwnProperty.call(object, key);
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
    var isProperty = createIsNativeType(Property);
    function getActiveItem() {
        return app.project.activeItem;
    }
    function getActiveComp() {
        var item = getActiveItem();
        return isCompItem(item) ? item : undefined;
    }
    var isTextDocument = createIsNativeType(TextDocument);
    function setUndoGroup(undoString, func) {
        app.beginUndoGroup(undoString);
        func();
        app.endUndoGroup();
    }
    function setPropertyValueByData(property, dataObject) {
        if (has(dataObject, "value")) {
            if (isTextDocument(property.value)) {
                var textObject = dataObject.value;
                var textValue_1 = property.value;
                forOwn(textObject, function(value, key) {
                    if (value) {
                        textValue_1[key] = value;
                    }
                });
                property.setValue(textValue_1);
            } else {
                property.setValue(dataObject.value);
            }
        }
        if (has(dataObject, "expression")) {
            property.expression = dataObject.expression;
        }
    }
    function setSelfProperty(property, dataObject) {
        if (has(dataObject, "enabled")) {
            property.enabled = dataObject.enabled;
        }
        if (has(dataObject, "name")) {
            property.name = dataObject.name;
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
    function showError(message) {
        alert(message);
    }
    var frameSize = [ 1920, 1080 ];
    var framePropertyData = {
        "S0000 selfProperty": {
            name: "frame"
        },
        "G0001 ADBE Root Vectors Group": {
            "G0001 ADBE Vector Group": {
                "S0000 selfProperty": {
                    "name": "frame"
                },
                "G0002 ADBE Vectors Group": {
                    "G0001 ADBE Vector Shape - Rect": {
                        "P0002 ADBE Vector Rect Size": {
                            "expression": "[thisComp.width,thisComp.height]"
                        }
                    },
                    "G0002 ADBE Vector Shape - Rect": {
                        "P0002 ADBE Vector Rect Size": {
                            "value": frameSize
                        }
                    },
                    "G0003 ADBE Vector Filter - Merge": {
                        "P0001 ADBE Vector Merge Type": {
                            "value": 5
                        }
                    },
                    "G0004 ADBE Vector Graphic - Fill": {
                        "P0004 ADBE Vector Fill Color": {
                            "value": [ 0.13725490868092, 0.13725490868092, 0.13725490868092, 1 ]
                        }
                    }
                }
            }
        },
        "G0002 ADBE Transform Group": {
            "P0001 ADBE Opacity": {
                "value": 80
            }
        }
    };
    function createFrameLayer(nowItem) {
        var shapeLayer = nowItem.layers.addShape();
        setPropertyByData(shapeLayer, framePropertyData);
        shapeLayer.guideLayer = true;
    }
    function main() {
        var nowItem = getActiveComp();
        if (!nowItem || !isCompItem(nowItem)) {
            return showError("请先选择一个图层/合成");
        }
        createFrameLayer(nowItem);
    }
    setUndoGroup("newFrameLayer", main);
}).call(this);

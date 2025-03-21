import * as _ from 'soil-ts';

function setPropertyValueByData(property: Property, dataObject: PropertyValueData) {
    // 设置 property 的值
    if (_.has(dataObject, 'keyframe')) {
        _.setKeyframeValues(property, dataObject.keyframe as Array<Keyframe>);
    } else if (_.has(dataObject, 'value')) {
        // 对于对象数据，最好的选择是直接在原属性上更改
        if (_.isObject(property.value)) {
            const objectValue = dataObject.value;
            const objValue = property.value;
            _.forOwn(objectValue, (value, key) => {
                if (value) {
                    objValue[key] = value;
                }
            });
            property.setValue(objValue);
        } else {
            property.setValue(dataObject.value);
        }
    }

    // 设置表达式
    if (_.has(dataObject, 'expression')) {
        property.expression = dataObject.expression;
    }
}

function setSelfProperty(property: _PropertyClasses, dataObject: PropertyMetadata) {
    // 通用设置函数
    const setSelf = (property_: _PropertyClasses) => {
        _.forOwn(dataObject, (value, key) => {
            if (_.has(property_, key)) {
                property_[key] = value;
            }
        });
    };

    // 设置并删除属性函数
    const setAndDelete = (property_: _PropertyClasses, key: string) => {
        if (_.has(dataObject, key)) {
            property_[key] = dataObject[key];
            delete dataObject[key];
        }
    };

    if (_.isLayer(property)) {
        const layer = property;
        let layerData = dataObject as RasterLayerMetadata; // 因为浅拷贝所以layerData实际上还是dataObject的引用，不过这样写在ts中可以更好的提示类型

        // 由于锁定会影响到属性的设置，因此需要先解锁
        let locked: boolean = _.has(layerData, 'locked') ? layerData.locked : layer.locked;
        delete layerData.locked;
        layer.locked = false;

        // 设置 inPoint, outPoint 和 startTime
        _.forEach(['startTime', 'inPoint', 'outPoint'], (key) => {
            setAndDelete(layer, key);
        });

        // 设置 height 和 width
        if (_.isSolidLayer(layer) || _.isCompLayer(layer)) {
            _.forEach(['height', 'width'], (key) => {
                setAndDelete(layer.source, key);
            });
        }

        // 设置 timeRemapEnabled
        if (_.isAVLayer(layer) && layer.canSetTimeRemapEnabled) {
            setAndDelete(layer, 'timeRemapEnabled');
        } else {
            // 如果不能设置，也应该删除对应属性
            delete layerData.timeRemapEnabled;
        }

        // 设置剩余属性
        setSelf(layer);

        // 恢复锁定状态
        layer.locked = locked;
    } else {
        // 其余属性可以直接遍历设置
        setSelf(property);
    }
}

/**
 * 根据数据结构设置属性
 * 
 * @param rootProperty 根属性
 * @param propertyData 数据结构
 * @since 0.1.0
 * @category utils
 * @example
 * const firstLayer = _.getFirstLayer();
 * const data = {
 *         "S0000 selfProperty": {
 *            name: "test"
 *        }
 * }
 * setPropertyByData(firstLayer, data);
 */
function setPropertyByData(rootProperty: _PropertyClasses, propertyData: PropertyDataStructure) {
    _.forOwn(propertyData, (value, key) => {
        if (_.startsWith(key, 'S', 0)) {
            setSelfProperty(rootProperty, value as PropertyMetadata);
            return;
        }
        const subProperty = _.addPropertyAlone(rootProperty, [key.substring(6)]);

        // 如果当前是一个 Group（包含子项）
        if (_.startsWith(key, 'G', 0)) {
            setPropertyByData(subProperty, value as PropertyDataStructure);
        } else if (_.startsWith(key, 'P', 0)) {
            if (_.isProperty(subProperty)) {
                setPropertyValueByData(subProperty, value as PropertyValueData);
            } else {
                alert(`在${key}键上遇到了错误\n该属性不为Property`);
            }
        } else {
            alert(
                `在${key}键上遇到了未定义的错误\n【旧版的数据格式可能不支持】\n请检查你的脚本是否为最新`,
            );
            return;
        }
    });
}

export default setPropertyByData
import * as _ from 'soil-ts';

const firstLayer = _.getFirstSelectedLayer();

function setPropertyValueByData(property: Property, dataObject: PropertyValueData) {
    // 设置 property 的值
    if (_.has(dataObject, 'value')) {
        // 由于文字图层的特殊性，最好的选择是直接在原属性上更改
        if (_.isTextDocument(property.value)) {
            const textObject = dataObject.value as canSetTextDocumentData
            const textValue = property.value
            _.forOwn(textObject, (value, key) => {
                if (value) {
                    textValue[key] = value
                }
            })
            property.setValue(textValue)
        } else {
            property.setValue(dataObject.value)
        }
    }

    // 设置表达式
    if (_.has(dataObject, 'expression')) {
        property.expression = dataObject.expression
    }
}

function setPropertyByData(rootProperty: _PropertyClasses, propertyData: PropertyDataStructure) {

    _.forOwn(propertyData, (value, key) => {

        if (_.startsWith(key, "S", 0)) {
            setSelfProperty(rootProperty, (value as PropertyMetadata))
            return
        }
        const subProperty = _.addPropertyAlone(rootProperty, [key.substring(6)])

        // 如果当前是一个 Group（包含子项）
        if (_.startsWith(key, "G", 0)) {
            setPropertyByData(subProperty, value as PropertyDataStructure)
        } else if (_.startsWith(key, "P", 0)) {
            if (_.isProperty(subProperty)) {
                setPropertyValueByData(subProperty, (value as PropertyValueData))
            } else {
                alert(`在${key}键上遇到了错误\n该属性不为Property`)
            }
        } else {
            alert(`在${key}键上遇到了未定义的错误\n【旧版的数据格式可能不支持】\n请检查你的脚本是否为最新`)
            return
        }
    })
}

function setSelfProperty(property: _PropertyClasses, dataObject: PropertyMetadata) {
    const specialProperty = ["height", "width"];
    _.forOwn(dataObject, (value, key) => {
        if(_.has(property, key)&&_.indexOf(specialProperty,key)===-1){ 
            property[key] = value
        }
    })
}

const data:PropertyDataStructure = {
    "S0000 selfProperty": {
        "name":"test",
        "enabled": true,
        "autoOrient": 4212,
        "inPoint": 0,
        "outPoint": 30.9,
        "startTime": 0,
        "stretch": 100,
        "label": 1,
        "locked": false,
        "shy": false,
        "solo": false,
        "adjustmentLayer": false,
        "audioEnabled": true,
        "blendingMode": 5212,
        "effectsActive": true,
        "frameBlendingType": 4012,
        "timeRemapEnabled": false,
        "threeDLayer": false,
        "guideLayer": false,
        "motionBlur": false,
        "preserveTransparency": false,
        "quality": 4614,
        "samplingQuality": 4812,
        "trackMatteType": 5012,
        "height": 1080,
        "width": 1920
    }
}

setPropertyByData(firstLayer, data)

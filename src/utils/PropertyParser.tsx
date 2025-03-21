import * as _ from 'soil-ts';
import { getTextDocumentValue, sortObjectKeysByData } from '.';


const selfKey = "S0000 selfProperty"

class PropertyParser {
    private readProperty = [
        "VectorsGroup",
        "TextProperties",
        "Transform",
        "OptionsGroup",
        "LayerStyles",
        "Mask",
        "Effect",
        "Audio",
        "Camera",
        "Light",
        "Marker",
        "TimeRemapping"
    ]
    public setReadProperty(readProperty: string[]) {
        this.readProperty = readProperty
    }

    public getRootPropertyData(rootProperty: _PropertyClasses): PropertyDataStructure {
        let data: PropertyDataStructure = {};
        if (_.isProperty(rootProperty) || _.isPropertyGroup(rootProperty)) {
            data = processProperty(rootProperty);
        } else if (_.isLayer(rootProperty)) {
            data = this.getLayerData(rootProperty);
        }
        return data
    }

    private getLayerData(layer: Layer): PropertyDataStructure {
        let data: PropertyDataStructure = {};

        data = this.processMarker(layer, data);
        data = this.processTransform(layer, data);

        if (_.isRasterLayer(layer)) {
            data = this.processRasterLayer(layer, data);
        } else {
            data = this.processNonRasterLayer(layer, data);
        }

        return sortObjectKeysByData(data);
    }

    private processMarker(layer: Layer, data: PropertyDataStructure): PropertyDataStructure {
        if (_.indexOf(this.readProperty, "Marker") !== -1) {
            const marker = layer.marker;
            if (marker.numKeys > 0) {
                data = {
                    ...data,
                    ...manualGetRootPropertyData(marker)
                };
            }
        }
        return data;
    }

    private processTransform(layer: Layer, data: PropertyDataStructure): PropertyDataStructure {
        if (_.indexOf(this.readProperty, "Transform") !== -1) {
            let transformData = manualGetRootPropertyData(layer.transform);

            const transformKey = _.keys(transformData)[0];
            let excludeTransformKey: RegExp;
            if (transformData.dimensionsSeparated) {
                excludeTransformKey = /^ADBE Position$/;
            } else {
                excludeTransformKey = /ADBE Position_\d+/;
            }
            _.forOwn(transformData[transformKey], (value, key) => {
                if (excludeTransformKey.test(key))
                    delete transformData[transformKey][key];
            });

            if (!_.isEmpty(transformData)) {
                data = { ...data, ...transformData };
            }
        }
        return data;
    }

    private processRasterLayer(layer: RasterLayer, data: PropertyDataStructure): PropertyDataStructure {
        data[selfKey] = getSelfMetadataByRasterLayer(layer);

        data = this.processEffects(layer, data);
        data = this.processMasks(layer, data);
        data = this.processLayerStyles(layer, data);
        data = this.processOptionsGroup(layer, data);
        data = this.processAudio(layer, data);
        data = this.processTimeRemapping(layer, data);
        data = this.processTextProperties(layer, data);
        data = this.processVectorsGroup(layer, data);

        return data;
    }

    private processNonRasterLayer(layer: Layer, data: PropertyDataStructure): PropertyDataStructure {
        data[selfKey] = getSelfMetadataByBaseLayer(layer);
        if (_.isCameraLayer(layer) && _.indexOf(this.readProperty, "Camera") !== -1) {
            data = { ...data, ...manualGetRootPropertyData(layer.cameraOption) };
        } else if (_.isLightLayer(layer) && _.indexOf(this.readProperty, "Light") !== -1) {
            data = { ...data, ...manualGetRootPropertyData(layer.lightOption) };
        }
        return data;
    }

    private processEffects(layer: RasterLayer, data: PropertyDataStructure): PropertyDataStructure {
        if (_.indexOf(this.readProperty, "Effect") !== -1) {
            data = { ...data, ...manualGetRootPropertyData(layer.effect) };
        }
        return data;
    }

    private processMasks(layer: RasterLayer, data: PropertyDataStructure): PropertyDataStructure {
        if (_.indexOf(this.readProperty, "Mask") !== -1) {
            data = { ...data, ...manualGetRootPropertyData(layer.mask) };
        }
        return data;
    }

    private processLayerStyles(layer: RasterLayer, data: PropertyDataStructure): PropertyDataStructure {
        if (_.indexOf(this.readProperty, "LayerStyles") !== -1) {
            const layerStyle = layer.layerStyle;
            if (layerStyle.canSetEnabled) {
                let layerStyleDate = {
                    ...{
                        "S0000 selfProperty": {
                            enabled: layerStyle.enabled
                        }
                    },
                    ...manualGetRootPropertyData(layerStyle.blendingOption)
                };

                for (let i = 2; i <= layerStyle.numProperties; i++) {
                    if (layerStyle.property(i).canSetEnabled) {
                        layerStyleDate = {
                            ...layerStyleDate,
                            ...manualGetRootPropertyData(layerStyle.property(i) as PropertyGroup, true)
                        };
                    }
                }

                data = {
                    ...data,
                    ...{ [`G${_.padStart(layerStyle.propertyIndex.toString(), 4, "0")} ${layerStyle.matchName}`]: layerStyleDate }
                };
            }
        }
        return data;
    }

    private processOptionsGroup(layer: RasterLayer, data: PropertyDataStructure): PropertyDataStructure {
        if (layer.threeDLayer) {
            if (_.indexOf(this.readProperty, "OptionsGroup") !== -1) {
                data = {
                    ...data,
                    ...manualGetRootPropertyData(layer.geometryOption),
                    ...manualGetRootPropertyData(layer.materialOption),
                };
            }
        }
        return data;
    }

    private processAudio(layer: RasterLayer, data: PropertyDataStructure): PropertyDataStructure {
        if (_.indexOf(this.readProperty, "Audio") !== -1 && layer.hasAudio) {
            data = {
                ...data,
                ...manualGetRootPropertyData(layer.audio),
            };
        }
        return data;
    }

    private processTimeRemapping(layer: RasterLayer, data: PropertyDataStructure): PropertyDataStructure {
        if (_.isAVLayer(layer)) {
            if (_.indexOf(this.readProperty, "TimeRemapping") !== -1 &&
                layer.canSetTimeRemapEnabled && 
                layer.timeRemapEnabled) {
                data = {
                    ...data,
                    ...manualGetRootPropertyData(layer.timeRemap),
                };
            }
        }
        return data;
    }

    private processTextProperties(layer: RasterLayer, data: PropertyDataStructure): PropertyDataStructure {
        if (_.isTextLayer(layer)) {
            if (_.indexOf(this.readProperty, "TextProperties") !== -1) {
                let textObject = manualGetRootPropertyData(layer.text);
                let textDocument = textObject['G0002 ADBE Text Properties']['P0001 ADBE Text Document'] as PropertyValueData;
                if (textDocument.value) {
                    textDocument.value = getTextDocumentValue(textDocument.value);
                } else if (textDocument.Keyframe) {
                    textDocument.Keyframe = _.forEach(textDocument.Keyframe, (Keyframe) => {
                        Keyframe.keyValue = getTextDocumentValue(Keyframe.keyValue);
                    });
                }
                textObject['G0002 ADBE Text Properties']['P0001 ADBE Text Document'] = textDocument;

                data = { ...data, ...textObject };
            }
        }
        return data;
    }

    private processVectorsGroup(layer: RasterLayer, data: PropertyDataStructure): PropertyDataStructure {
        if (_.isShapeLayer(layer)) {
            if (_.indexOf(this.readProperty, "VectorsGroup") !== -1) {
                data = { ...data, ...manualGetRootPropertyData(_.getProperty(layer, ["ADBE Root Vectors Group"])) };
            }
        }
        return data;
    }
}




/**
 * 根据给定的图层属性，获取其根属性数据,平时请使用getRootPropertyData,这个函数是为了做手动干预而存在的。
 * 
 * 该函数根据 `rootProperty` 的类型（`CanSetValueProperty` 或 `PropertyGroup`）来获取对应的属性数据。根据 `isModified` 参数判断是否强制读取属性数据。
 * 如果 `isModified` 为 `true`，则强制读取该属性。
 *
 * @param {_PropertyClasses} rootProperty 目标根属性,不一定需要传属性,也可以传图层
 * @param {Array<string>} [readProperty] 读取的属性,默认为空,如果不传则读取所有属性
 * @returns {PropertyDataStructure} 包含根属性数据的对象。
 * @category utils
 * @example
 *  if (_.isLayer(firstLayer)) {
 *     const dataObject = getRootPropertyData(firstLayer)
 *     _.logJson(dataObject)
 * } else {
 *     $.writeln("请选择图层")
 * }
 */
function getRootPropertyData(rootProperty: _PropertyClasses, readProperty?: Array<string>): PropertyDataStructure {
    const parser = new PropertyParser()
    if (readProperty) {
        parser.setReadProperty(readProperty)
    }
    return parser.getRootPropertyData(rootProperty)
}


function processProperty(property: _PropertyClasses | PropertyGroup, index?: number): PropertyDataStructure {
    let data: PropertyDataStructure = {};
    const matchName = property?.matchName

    if (_.isPropertyGroup(property) || _.isMaskPropertyGroup(property)) {
        // 如果是属性组，递归处理
        const groupKey = `G${_.padStart(index?.toString() || "1", 4, "0")} ${matchName}`;
        data[groupKey] = getPropertyGroupData(property);
    } else if (_.canSetPropertyValue(property) && property.isModified) {
        // 如果是可以设置值的属性，处理它
        const key = `P${_.padStart(index?.toString() || "1", 4, "0")} ${matchName}`;
        data[key] = getPropertyData(property);
    }

    return data;
}


function getLayerDataOld(layer: Layer): PropertyDataStructure {
    let data: PropertyDataStructure = {};

    for (let i = 1; i <= layer.numProperties; i++) {
        const property = _.getProperty(layer, [i]);
        const propertyData = processProperty(property, i);
        data = { ...data, ...propertyData };
    }
    return data
}

/**
 * 根据给定的图层属性，获取其根属性数据,平时请使用getRootPropertyData,这个函数是为了做手动干预而存在的。
 * 
 * 该函数根据 `rootProperty` 的类型（`CanSetValueProperty` 或 `PropertyGroup`）来获取对应的属性数据。根据 `isModified` 参数判断是否强制读取属性数据。
 * 如果 `isModified` 为 `true`，则强制读取该属性。
 *
 * @param {CanSetValueProperty | PropertyGroup} rootProperty 目标属性对象，可以是一个可设置值的属性或一个属性组。
 * @param {boolean} [isModified=rootProperty.isModified] 是否强制读取属性数据。如果为 `false`，则返回空对象；如果为 `true`，则根据属性类型读取数据。
 * @returns {PropertyDataStructure} 包含根属性数据的对象。
 * @example
 * const rootProperty = _.getProperty(layer, [0]);
 * const propertyData = manualGetRootPropertyData(rootProperty);
 * $.writeln(_.stringify(propertyData));
 */
function manualGetRootPropertyData(rootProperty: CanSetValueProperty | PropertyGroup, isModified: boolean = rootProperty.isModified): PropertyDataStructure {
    let data: PropertyDataStructure = {};
    if (!isModified) return data
    const { prefix, nested } = _.isProperty(rootProperty)
        ? { prefix: 'P', nested: getPropertyData(rootProperty) }
        : { prefix: 'G', nested: getPropertyGroupData(rootProperty) };

    data[`${prefix}${_.padStart(rootProperty.propertyIndex.toString(), 4, "0")} ${rootProperty.matchName}`] = nested
    return data
}

function getPropertyData(property: CanSetValueProperty): PropertyValueData {
    let data: PropertyValueData = {}

    // 调试用的临时属性
    data.name = property.name

    if (property.numKeys > 0) {
        data.Keyframe = _.getKeyframeValues(property);
    } else {
        data.value = property.value;
    }

    if (property.expressionEnabled) {
        data.expression = property.expression;
    }
    return data
}


function getPropertyGroupData(propertyGroup: PropertyGroup): PropertyDataStructure {
    let data: PropertyDataStructure = {};

    const selfMetadata = getSelfMetadata(propertyGroup);
    // 添加元数据
    if (!_.isEmpty(selfMetadata)) {
        data[selfKey] = selfMetadata;
    }
    for (let i = 1; i <= propertyGroup.numProperties; i++) {
        const property = _.getProperty(propertyGroup, [i]);
        // 递归处理属性
        const propertyData = processProperty(property, i);
        // 合并属性数据
        data = { ...data, ...propertyData };
    }
    return data;
}

function getSelfMetadata(propertyGroup: PropertyGroup, readName: boolean = false): PropertyMetadata {
    let data: PropertyMetadata = {};
    if (propertyGroup.canSetEnabled) data.enabled = propertyGroup.enabled;
    if (readName) {
        data.name = propertyGroup.name;
    } else if (_.isNamedGroupType(propertyGroup) && _.isIndexedGroupType(propertyGroup.propertyGroup(1))) {
        data.name = propertyGroup.name
    }

    return data;
}

function getSelfMetadataByBaseLayer(layer: Layer): BaseLayerMetadata {
    let data: BaseLayerMetadata = getSelfMetadata(layer, true);

    return {
        ...data,
        autoOrient: layer.autoOrient,
        inPoint: layer.inPoint,
        outPoint: layer.outPoint,
        startTime: layer.startTime,
        stretch: layer.stretch,
        //time: layer.time,         readOnly
        label: layer.label,
        locked: layer.locked,
        shy: layer.shy,
        solo: layer.solo,
    };
}

function getSelfMetadataByRasterLayer(layer: RasterLayer): RasterLayerMetadata {
    let data: RasterLayerMetadata = getSelfMetadataByBaseLayer(layer);

    if (_.isTextLayer(layer)) {
        data = {
            ...data,
            threeDPerChar: layer.threeDPerChar
        };
    }
    return {
        ...data,
        adjustmentLayer: layer.adjustmentLayer,
        audioEnabled: layer.audioEnabled,
        blendingMode: layer.blendingMode,
        effectsActive: layer.effectsActive,
        //environmentLayer: layer.environmentLayer,         需要特殊判断，反正二维片不常用就不管了
        frameBlendingType: layer.frameBlendingType,
        timeRemapEnabled: layer.timeRemapEnabled,
        threeDLayer: layer.threeDLayer,
        guideLayer: layer.guideLayer,
        motionBlur: layer.motionBlur,
        preserveTransparency: layer.preserveTransparency,
        quality: layer.quality,
        samplingQuality: layer.samplingQuality,
        trackMatteType: layer.trackMatteType,
        height: layer.height,
        width: layer.width
    };
}



export { getRootPropertyData, getLayerDataOld }

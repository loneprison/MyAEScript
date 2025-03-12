import * as _ from 'soil-ts';

// 需求 @光学核心

interface EffectData {
    [key: string]: {
        name?: string,
        enabled?: boolean,
        values?: {
            [key: string]: {
                value?: any,
                expression?: string
            }
        }
    }
}

interface JSONData {
    name?: string,
    comment?: string,
    enabled?: boolean,
    blendMode?: BlendingMode,
    adjustmentLayer?: boolean,
    opacity?: number,
    effects?: EffectData
}

function setPropertyData(layer: RasterLayer, data: JSONData): void {
    // 设置名称
    if (_.has(data, "name")) layer.name = data.name;
    // 设置注释
    if (_.has(data, "comment")) layer.comment = data.comment;
    // 设置是否启用
    if (_.has(data, "enabled")) layer.enabled = data.enabled;
    // 设置混合模式
    if (_.has(data, "blendMode")) layer.blendingMode = data.blendMode;
    // 设置调整图层
    if (_.has(data, "adjustmentLayer")) layer.adjustmentLayer = data.adjustmentLayer;
    // 设置不透明度
    if (_.has(data, "opacity")) layer.opacity.setValue(data.opacity);
    // 设置效果
    if (_.has(data, "effects")) setEffectsData(layer, data.effects);
}
function setEffectsData(layer: RasterLayer, effectsData: EffectData): void {
    const effects = layer.effect;
    for (const key in effectsData) {
        const effectData = effectsData[key];
        const effect = effects.addProperty(key.substring(5)) as PropertyGroup;
        setEffectProperties(effect, effectData);
    }
}

function setEffectProperties(effect: PropertyGroup, effectData: any): void {
    if (_.has(effectData, "enabled")) { effect.enabled = effectData.enabled };
    if (_.has(effectData, "name")) { effect.name = effectData.name };
    if (_.has(effectData, "values")) {
        setEffectValues(effect, effectData.values);
    }
}

function setEffectValues(effect: PropertyGroup, values: any): void {
    for (const propKey in values) {
        const propData = values[propKey];
        const prop = effect.property(propKey) as Property;
        if (_.has(propData, "value")) {
            prop.setValue(propData.value);
        }
        if (_.has(propData, "expression")) {
            prop.expression = propData.expression;
            prop.expressionEnabled = true;
        }
    }
}


// 使用案例
const firstSelectLayer = (app.project.activeItem as CompItem).selectedLayers[0];
if (_.isRasterLayer(firstSelectLayer)) {
    const jsonData: JSONData = {
        "opacity": 100,
        "blendMode": 5212,
        "effects": {
            "0001 F's MainLineRepaint": {
                "enabled": true,
                "name": "js_F's MainLineRepaint",
                "values": {
                    "F's MainLineRepaint-0001": {
                        "value": [
                            0.1803921610117,
                            0.15686275064945,
                            0.15686275064945,
                            1
                        ]
                    }
                }
            },
            "0002 ADBE Simple Choker": {
                "enabled": false,
                "name": "js_Simple Choker",
                "values": {
                    "ADBE Simple Choker-0002": {
                        "value": 1.5
                    }
                }
            },
            "0003 ADBE Easy Levels2": {
                "enabled": false,
                "name": "js_Levels"
            }
        }
    }

    setPropertyData(firstSelectLayer, jsonData);
    $.writeln("属性设置成功");

} else {
    $.writeln("不支持设置灯光/摄像机图层");
}

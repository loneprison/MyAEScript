import * as _ from 'soil-ts';
import { copyToClipboardAdvance } from '../../utils';

// 需求 @光学核心

function getPropertyData(layer: RasterLayer): AnyObject {
    const data: AnyObject = {}
    if (layer.name !== layer.source.name) data.name = layer.name;
    if (layer.comment !== "") data.comment = layer.comment;
    // 读取是否启用
    data.enabled = layer.enabled;
    // 读取混合模式
    data.blendMode = layer.blendingMode;

    // 读取调整图层,只有调整图层开启才读取
    if(layer.adjustmentLayer) data.adjustmentLayer = layer.adjustmentLayer;

    // 读取不透明度
    data.opacity = layer.opacity.value;
    // 读取效果
    const effectsData = getEffectsData(layer);
    if (!_.isEmpty(effectsData)) {
        data.effects = effectsData;
    }

    return data
}

function getEffectsData(layer: RasterLayer): AnyObject {
    const effectsData: AnyObject = {};

    const effects = layer.effect;
    // 第一层for,用来遍历出不同的种类的效果
    for (let i = 1; i <= effects.numProperties; i++) {
        const effect = effects.property(i) as PropertyGroup;
        const data: AnyObject = {};
        data.enabled = effect.enabled;
        data.name = effect.name;
        const values: AnyObject = {};
        for (let j = 1; j <= effect.numProperties; j++) {
            const prop = effect.property(j) as Property;
            const propValueData: AnyObject = {}

            if (_.canSetPropertyValue(prop) && !!prop.isModified) {
                propValueData["value"] = prop.value;
            }
            // 如果可以设置表达式并且表达式开启则读取表达式
            if (prop.canSetExpression && prop.expressionEnabled) {
                propValueData["expression"] = prop.expression;
            }
            _.isEmpty(propValueData) || (values[prop.matchName] = propValueData);
        }
        if (!_.isEmpty(values)) {
            data["values"] = values;
        }
        effectsData[`${_.padStart(effect.propertyIndex.toString(), 4, "0")} ${effect.matchName}`] = data;
    }

    // 预留函数实现
    return effectsData;
}

const item = app.project.activeItem
if (_.isCompItem(item) && item.selectedLayers.length > 0) {
    const firstSelectLayer = item.selectedLayers[0]
    if (_.isRasterLayer(firstSelectLayer)) {
        const projectData = getPropertyData(firstSelectLayer)
        //$.writeln(_.stringify(projectData))
        copyToClipboardAdvance(_.stringify(projectData))
        $.writeln(_.stringify(projectData))
    } else {
        $.writeln("不支持读取灯光/摄像机图层")
    }
} else {
    $.writeln("请选中一个图层")
}
import * as _ from "soil-ts";

type Bounds = [number, number, number, number];

function getDecimalLength(value: number): number {
    const str = value.toString().split(".");
    return str.length > 1 ? str[1].length : 0;
}

function multiply(value1: number, value2: number): number {
    const decimalLength1 = getDecimalLength(value1);
    const decimalLength2 = getDecimalLength(value2);
    const factor = Math.pow(10, decimalLength1 + decimalLength2);

    return (Math.round(value1 * Math.pow(10, decimalLength1)) *
        Math.round(value2 * Math.pow(10, decimalLength2))) / factor;
}

function subtract(value1: number, value2: number): number {
    const maxDecimal = Math.max(getDecimalLength(value1), getDecimalLength(value2));
    const factor = Math.pow(10, maxDecimal);

    return (Math.round(value1 * factor) - Math.round(value2 * factor)) / factor;
}

function getRectangleBounds(layer: Layer): Bounds {
    if (!_.isRasterLayer(layer)) return [0, 0, 0, 0];
    const position = _.getProperty<TwoDProperty>(layer, ["ADBE Transform Group", "ADBE Position"]).value
    const scale = _.getProperty<TwoDProperty>(layer, ["ADBE Transform Group", "ADBE Scale"]).value

    const width = (layer.width * scale[0]) / 100;
    const height = (layer.height * scale[1]) / 100;

    return [
        position[0] - width / 2,
        position[1] - height / 2,
        position[0] + width / 2,
        position[1] + height / 2
    ];
}

function mergeBounds(boundsList: Bounds[]): Bounds {
    if (_.isEmpty(boundsList)) {
        throw new Error("boundsList 不能为空");
    }

    return _.reduce(boundsList, ([xMin, yMin, xMax, yMax], [x1, y1, x2, y2]) => [
        Math.min(xMin, x1),
        Math.min(yMin, y1),
        Math.max(xMax, x2),
        Math.max(yMax, y2)
    ], [Infinity, Infinity, -Infinity, -Infinity]);
}

function setNullLayerPosition(layer: Layer, position: [number, number]): void {
    _.setPropertyValue(layer, ["ADBE Transform Group", "ADBE Position"], position);
}

_.setUndoGroup("Resize Comp to Selected Layers", () => {
    const comp = _.getActiveComp();
    const selectedLayers = _.getSelectedLayers();
    if (!comp || !selectedLayers) return;

    // 记录原始父级和锁定状态
    const layers = _.collectionToArray(comp.layers);
    const originalState = _.map(layers, (layer) => ({
        parent: layer.parent,
        locked: layer.locked,
    }));

    // 解锁并移除父级
    _.forEach(layers, (layer) => _.assign(layer, { locked: false, parent: null }));

    // 计算新边界
    const newBounds = mergeBounds(_.map(selectedLayers, getRectangleBounds));

    // 添加空物体，重新设定大小
    const nullLayer = comp.layers.addNull();
    setNullLayerPosition(nullLayer, [newBounds[0], newBounds[1]]);

    comp.width = Math.floor(subtract(newBounds[2], newBounds[0]));
    comp.height = Math.floor(subtract(newBounds[3], newBounds[1]));

    // 设定新父级
    _.forEach(_.range(2, comp.numLayers + 1), (i) => {
        comp.layer(i).parent = nullLayer;
    });

    // 还原空物体位置并删除
    setNullLayerPosition(nullLayer, [0, 0]);
    nullLayer.source.remove();

    // 还原原始父级和锁定状态
    _.forEach(layers, (layer, i) => {
        _.assign(layer, originalState[i]);
    });

    const alertMessage = _.compact([
        comp.width % 2 !== 0 ? "合成宽度为奇数!!!" : null,
        comp.height % 2 !== 0 ? "合成高度为奇数!!!" : null
    ]).join("\n");

    if (alertMessage) alert(alertMessage);
});



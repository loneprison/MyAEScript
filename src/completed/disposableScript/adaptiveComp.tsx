import * as _ from "soil-ts";
import { getBoundsByLayers } from "../../utils";

_.setUndoGroup("Resize Comp to Selected Layers", () => {
    // 初始化
    const comp = _.getActiveComp();
    const selectedLayers = _.getSelectedLayers();
    const ALL_NOT_AVlayer = _.some(selectedLayers, (layer) => !_.isAVLayer(layer));
    if (!comp || ALL_NOT_AVlayer) return alert("需要至少选择一个有效图层\n形状/文字/灯光/摄像机图层不支持");


    // 记录原始父级和锁定状态并删除父级和锁定
    const layers = _.collectionToArray(comp.layers);
    const originalState = _.map(layers, (layer) => {
        const state = {
            parent: layer.parent,
            locked: layer.locked,
        };
        _.assign(layer, { locked: false, parent: null });
        return state;
    });

    // 计算新边界
    const newBounds = getBoundsByLayers(selectedLayers)

    // 添加空物体，重新设定大小
    const nullLayer = comp.layers.addNull();
    const setNullLayerPosition = (position: TwoDPoint): void => {
        _.setPropertyValue(nullLayer, ["ADBE Transform Group", "ADBE Position"], position);
    }

    setNullLayerPosition([newBounds[0], newBounds[1]]);

    comp.width = Math.ceil(newBounds[2] - newBounds[0]);
    comp.height = Math.ceil(newBounds[3] - newBounds[1]);

    // 设定新父级
    _.forEach(_.range(2, comp.numLayers + 1), (i) => {
        comp.layer(i).parent = nullLayer;
    });

    // 还原空物体位置并删除
    setNullLayerPosition([0, 0]);
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
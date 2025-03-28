import * as _ from 'soil-ts';
import { sortLayersByIndex, sortLayersByName } from '../../utils/index';


// 一次性脚本，即为了某个工作流程开发的【临时的一次性的脚本】，因此不具备通用性和严谨性

// 防止自动清理清理【它所认为的无关代码】而做的特殊处理
const getStr = (str: string): string => str;

// 判断字符串是否属于指定的多个值之一
const isWhatStr = <T extends string>(str: string, ...args: T[]): str is T => {
    return _.indexOf(args, str) !== -1;
};

// 判断是否为全是合成图层
const isAllCompLayer = (layerArray: Layer[]): layerArray is AVLayer[] =>
    !_.some(layerArray, layer => !_.isCompLayer(layer));

// 通用的排序和时间设置逻辑
const sortAndSetLayerTimes = (layers: Layer[], sortMode: "index" | "name", frameDuration: number) => {
    // 根据排序模式排序图层
    let sortedLayers = (sortMode === 'index')
        ? sortLayersByIndex(layers, "desc")
        : sortLayersByName(layers, "asc"); // 使用字典顺序

    // 初始化开始时间
    let currentStartTime = 0;

    // 设置无间隙的序列排序
    _.forEach(sortedLayers, (layer) => {
        layer.outPoint = frameDuration; // 设置结束时间
        layer.startTime = frameDuration * currentStartTime++; // 设置开始时间

        // 将图层移到合成的顶部，确保排序后图层位置正确
        layer.moveToBeginning();
    });

    return sortedLayers;
};

// 设置合成时长
const setCompDuration = (comp: CompItem, layers: Layer[], frameDuration: number) => {
    comp.duration = layers.length * frameDuration;
};

function SequenceLayers(sortMode: "index" | "name", selectMode: "current" | "internal") {
    if (selectMode === "current") {
        let selectedLayers = _.getSelectedLayers();
        let activeComp = _.getActiveComp();

        if (selectedLayers && activeComp) {
            const frameDuration = 1 / activeComp.frameRate; // 每帧的时间（秒）

            // 排序和设置图层时间
            selectedLayers = sortAndSetLayerTimes(selectedLayers, sortMode, frameDuration);

            // 将合成时长调整为图层的总时长
            setCompDuration(activeComp, selectedLayers, frameDuration);
        }
    } else {
        let selectedLayers = _.getSelectedLayers();

        if (isAllCompLayer(selectedLayers)) {
            _.forEach(selectedLayers, (layer) => {
                const comp = layer.source;
                const frameDuration = 1 / comp.frameRate; // 每帧的时间（秒）

                if (_.isCompItem(comp)) {
                    let layerArray = sortAndSetLayerTimes(_.collectionToArray(comp.layers), sortMode, frameDuration);

                    // 更新合成的持续时间
                    setCompDuration(comp, layerArray, frameDuration);
                }
            });
        } else {
            alert("不能选择非comp图层");
        }
    }
}


_.setUndoGroup("SequenceLayers", () => {
    const sortMode = getStr("index");
    const selectMode = getStr("current");

    if (isWhatStr(sortMode, "index", "name") && isWhatStr(selectMode, "current", "internal")) {
        SequenceLayers(sortMode, selectMode);
    }
});

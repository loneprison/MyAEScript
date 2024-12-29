import * as _ from 'soil-ts';

const firstLayer = _.getFirstSelectedLayer()

if (firstLayer) {
    // 获取位置属性
    const property = _.getProperty(firstLayer, ["ADBE Mask Parade", "ADBE Mask Atom", "ADBE Mask Shape"]);

    // 确保属性存在且有关键帧
    if (_.canSetPropertyValue(property) && property.numKeys > 0) {
        const keyframeObjects = _.getKeyframeValues(property)
        $.writeln(_.stringify(keyframeObjects))
    } else {
        $.writeln("No keyframes found on the Position property.");
    }
} else {
    $.writeln("No layer selected or invalid selection.");
}
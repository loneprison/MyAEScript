import * as _ from 'soil-ts';

const firstLayer = _.getFirstSelectedLayer()

if (firstLayer) {
    // 获取位置属性
    const position = _.getProperty(firstLayer, ["ADBE Transform Group", "ADBE Position"]);
    
    // 确保属性存在且有关键帧
    if (_.isProperty(position) &&_.canSetPropertyValue(position)&& position.numKeys > 0) {
        const keyframeObjects = _.getKeyframeValues(position)
        $.writeln(_.stringify(keyframeObjects))
    } else {
        $.writeln("No keyframes found on the Position property.");
    }
} else {
    $.writeln("No layer selected or invalid selection.");
}


import * as _ from 'soil-ts';
import { getRootPropertyData } from '../../utils';

const firstLayer = _.getFirstSelectedLayer();

if (_.isLayer(firstLayer)) {
    const dataObject = getRootPropertyData(firstLayer)
    _.logJson(dataObject)
    $.writeln("请在桌面查看soil_log.json文件获得结果")
} else {
    $.writeln("请选择图层")
}
import * as _ from 'soil-ts';

let data: PropertyDataStructure = {
    "G0006 ADBE Transform Group": {
        "P0002 ADBE Position": {
            "name": "位置",
            "value": [
                960,
                540,
                0
            ]
        },
        "P0003 ADBE Position_0": {
            "name": "X 位置",
            "value": 960
        },
        "P0004 ADBE Position_1": {
            "name": "Y 位置",
            "value": 540
        }
    },
}

const keysToOmit = ["P0002 ADBE Position"];

// 获取唯一的第一层键
const rootKey = _.keys(data)[0];

// 删除子对象中的目标键
data[rootKey] = _.omit(data[rootKey] as AnyObject, ["P0002 ADBE Position"])

$.write(_.stringify(data))
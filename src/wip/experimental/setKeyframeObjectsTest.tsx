import * as _ from 'soil-ts';

const firstLayer = _.getFirstSelectedLayer()

const keyDate:Keyframe[] = [
    {
        "keyTime": 0,
        "keyValue": [
            1178.5,
            663,
            0
        ],
        "keySelected": false,
        "keyInTemporalEase": [
            {
                "influence": 16.666666667,
                "speed": 0
            }
        ],
        "keyOutTemporalEase": [
            {
                "influence": 16.666666667,
                "speed": 255.143499755859
            }
        ],
        "keyTemporalContinuous": false,
        "keyTemporalAutoBezier": false,
        "keyInInterpolationType": 6612,
        "keyOutInterpolationType": 6612,
        "keyInSpatialTangent": [
            -35.436595916748,
            0,
            0
        ],
        "keyOutSpatialTangent": [
            35.436595916748,
            0,
            0
        ],
        "keySpatialAutoBezier": true,
        "keySpatialContinuous": true,
        "keyRoving": false,
        "keyLabel": 0
    },
    {
        "keyTime": 0.83333333333333,
        "keyValue": [
            1391.11958312988,
            663,
            0
        ],
        "keySelected": false,
        "keyInTemporalEase": [
            {
                "influence": 16.666666667,
                "speed": 255.143499755859
            }
        ],
        "keyOutTemporalEase": [
            {
                "influence": 16.666666667,
                "speed": 0
            }
        ],
        "keyTemporalContinuous": false,
        "keyTemporalAutoBezier": false,
        "keyInInterpolationType": 6612,
        "keyOutInterpolationType": 6612,
        "keyInSpatialTangent": [
            -35.436595916748,
            0,
            0
        ],
        "keyOutSpatialTangent": [
            35.436595916748,
            0,
            0
        ],
        "keySpatialAutoBezier": true,
        "keySpatialContinuous": true,
        "keyRoving": false,
        "keyLabel": 0
    }
]



if (firstLayer) {
    // 获取位置属性
    const position = _.getProperty(firstLayer, ["ADBE Transform Group", "ADBE Position"]);
    
    // 确保属性存在且有关键帧
    if (_.isProperty(position) &&_.canSetPropertyValue(position)&& position.numKeys > 0) {
        _.setKeyframeValues(position,keyDate)
    } else {
        $.writeln("No keyframes found on the Position property.");
    }
} else {
    $.writeln("No layer selected or invalid selection.");
}


import * as _ from 'soil-ts';
import { setPropertyByData } from '../../utils';

function showError(message: string): void {
    alert(message);
}

const frameSize = [1920, 1080]

const framePropertyData: PropertyDataStructure = {
    "S0000 selfProperty":{
        name:"frame"
    },
    'G0001 ADBE Root Vectors Group': {
        "G0001 ADBE Vector Group": {
            "S0000 selfProperty": {
                "name": "frame"
            },
            "G0002 ADBE Vectors Group": {
                "G0001 ADBE Vector Shape - Rect": {
                    "P0002 ADBE Vector Rect Size": {
                        "expression": "[thisComp.width,thisComp.height]"
                    }
                },
                "G0002 ADBE Vector Shape - Rect": {
                    "P0002 ADBE Vector Rect Size": {
                        "value": frameSize
                    }
                },
                "G0003 ADBE Vector Filter - Merge": {
                    "P0001 ADBE Vector Merge Type": {
                        "value": 5
                    }
                },
                "G0004 ADBE Vector Graphic - Fill": {
                    "P0004 ADBE Vector Fill Color": {
                        "value": [
                            0.13725490868092,
                            0.13725490868092,
                            0.13725490868092,
                            1
                        ]
                    }
                }
            }
        }
    },          
    "G0002 ADBE Transform Group": {
        "P0001 ADBE Opacity": {
            "value": 80
        }
    }
}

function createFrameLayer(nowItem: CompItem): void {
    // 创建一个新的形状图层
    const shapeLayer = nowItem.layers.addShape();
    setPropertyByData(shapeLayer, framePropertyData)
    shapeLayer.guideLayer = true
}

_.setUndoGroup("newFrameLayer", ()=>{
    const nowItem = _.getActiveComp();
    if (!nowItem || !_.isCompItem(nowItem)) {
        return showError('请先选择一个图层/合成');
    }

    createFrameLayer(nowItem);
});
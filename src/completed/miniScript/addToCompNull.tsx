import * as _ from 'soil-ts';
import { setPropertyByData } from '../../utils';

_.setUndoGroup("addToCompNull", () => {
    const activeComp = _.getActiveComp();
    const firstLayer = _.getFirstSelectedLayer();
    const layerName = "目标点图层";

    if (activeComp) {
        if (!activeComp.activeCamera) { alert("请确保合成内至少有一个摄像机/三维图层\n在创建之前将会遇到表达式报错") }
        const newNullLayer = activeComp.layers.addNull();
        setPropertyByData(newNullLayer, {
            "S0000 selfProperty": {
                "name": `Null-toComp`,
            },
            "G0005 ADBE Effect Parade": {
                "G0001 ADBE Layer Control": {
                    "S0000 selfProperty": {
                        "enabled": true,
                        "name": layerName
                    }
                },
            },
            "G0006 ADBE Transform Group": {
                "P0001 ADBE Anchor Point": {
                    value: [newNullLayer.width / 2, newNullLayer.height / 2]
                },
                "P0002 ADBE Position": {
                    "expression": "effect(\"目标点图层\")(1).toComp(effect(\"目标点图层\")(1).transform.anchorPoint)"
                },
                "P0006 ADBE Scale": {
                    "expression": "var _layer = effect(\"目标点图层\")(1);\r\n\r\nvar P1 = thisComp.activeCamera.toWorld(transform.anchorPoint);\r\nvar P2 = _layer.toWorld(_layer.transform.anchorPoint);\r\n\r\nvar zoom = thisComp.activeCamera.cameraOption.zoom;\r\nvar cameraForward = normalize(thisComp.activeCamera.toWorldVec([0, 0, 1]));\r\n\r\nvar displacement = P2 - P1;\r\nvar parallelDistance = dot(displacement, cameraForward);\r\n\r\nif (parallelDistance <= 0) {\r\n    [0, 0];\r\n} else {\r\n    var perpendicularDistance = length(displacement - parallelDistance * cameraForward);\r\n    var _scale = zoom / parallelDistance * 100;\r\n\r\n    [_scale, _scale];\r\n}\r\n"
                }
            }
        })
        if (firstLayer) {
            newNullLayer.moveBefore(firstLayer);

            setPropertyByData(newNullLayer, {
                "S0000 selfProperty": {
                    "name": `${firstLayer.name}-toComp`,
                },
                "G0005 ADBE Effect Parade": {
                    [`G0001 ${layerName}`]: {
                        "P0001 ADBE Layer Control-0001": {
                            value: firstLayer.index
                        }
                    }
                }
            })
        }
    } else {
        alert("请先选择一个图层")
    }
})
